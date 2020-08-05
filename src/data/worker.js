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
    default() {
        return console.warn('unknown worker fx') || {default:'unknown worker fx'}
    }
}

self.onmessage = async function({data: [fx, ...params]}) {
    if(!Object.keys(methods).includes(fx)) fx='default'
    const res = await methods[fx](...params)
    if(res!==undefined) self.postMessage(res)
}