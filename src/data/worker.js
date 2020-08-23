import {offDB} from './offline.js'
import { queryData, mutateData } from './dgraph.js'

const methods = {
    async init(params) {
        console.log('init called with: ',params)

        console.log('offDB',offDB);
        try {
            const res = await queryData()
            console.log("Fetched from dgraph:",res);
            const peepz = res.everyone
            this.dataset = peepz || []
            if(peepz && peepz.length){
                // console.log(`${peepz.length} peepz`)
                for(let eachPerson of peepz){
                    // console.log(eachPerson)
                    const {friendships = [], ...values} = eachPerson
                    await offDB.people.put(values)
                    for(let eachFriendship of friendships){
                        const edgeid=`${eachPerson.uid}|->|${eachFriendship.uid}`
                        // console.log('adding friendship:',edgeid,offDB)
                        await offDB.friendships.put({edgeid,s:eachPerson.uid,o:eachFriendship.uid,isMutual:'?'})
                    }
                }
            }
            console.log(await offDB.people.count(), ' people in idb')
            return { isOffDBready: true }
        } catch(e)  {
            return console.warn("ERROR in initial fetch: ", e) || { error: e }
        }

        
    },
    async update(newData) {
        const modDate=new Date()
        newData.row.modified=modDate.toISOString()
        console.log('cellUpdated:', newData)
    
        console.log('offDB in worker update:',offDB);
        
        // Dexie
        const dexVal = (await offDB.people.get(newData.row.uid)) || newData;
        console.log('current dexie record:', dexVal);
    
        
        // TODO create revisions in single rows (less micro managing here)
        // TODO consider data model for storing revisions in dgraph ( )
        if(newData.column.field=='name@en'){
          newData.row.name = newData.row['name@en'] = newData.value
          const modTS=modDate.getTime()
          let st=performance.now()
          const revs = await offDB.revisions.get(`${newData.row.uid}.${newData.column.field}`)
          const msForDirectGet = performance.now() - st;
          st = performance.now()
          const revsByQuery = await offDB.revisions.where({uid:newData.row.uid,prop:newData.column.field}).first()
          const msForQuery= performance.now() - st;
          console.log(`direct: ${msForDirectGet} VS query: ${msForQuery}`, msForQuery-msForDirectGet)
          const revMap = (revs && revs.revMap) ? revs.revMap : {};
          revMap[modTS] = newData.value;
          offDB.revisions.put({
            revid:`${newData.row.uid}.${newData.column.field}`,
            uid:newData.row.uid,
            prop:newData.column.field,
            revMap})
        }
    
        await offDB.people.put(newData.row);
        
        const mu = `
          <${newData.row.uid}> <${newData.column.field}> "${newData.value}" (modified=${newData.row.modified}) .
          <${newData.row.uid}> <modified> "${newData.row.modified}" .
        `
        console.log('mutation:', mu)
        const response = await mutateData({setNquads:mu})
        return { response, isUpdateDone:true }    
    },
    default() {
        return console.warn('unknown worker fx') || {default:'unknown worker fx'}
    }
}

self.onmessage = async function({data: [fx, ...params]}) {
    if(!Object.keys(methods).includes(fx)) fx='default'
    const res = await methods[fx](...params)
    if(res!==undefined) self.postMessage(res)
}