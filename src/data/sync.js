import {offDB} from './offline.js'
import { mutateData } from '../data/dgraph'
import { deferredPromise } from '../utils/async.js'

const isOffline = false

console.log(offDB,'before worker')
const worker = new Worker('./worker.js', { type: 'module' })

const addFriendshipsImpure = async function addFriendshipsToPeopleArray(peopleArray){
    for(let eachPerson of peopleArray){
        const dataFriendships = await offDB.friendships.where({s:eachPerson.uid}).toArray()
        const humanReadable = []
        for(let eachFriendship of dataFriendships){
            const eachFriend = await offDB.people.where({uid:eachFriendship.o}).first()
            const isMutual =  !!(await offDB.friendships.where({s:eachFriend.uid,o:eachPerson.uid}).first())
            humanReadable.push( { uid: eachFriend.uid, name: eachFriend.name, isMutual })
        }
        eachPerson.friendships = humanReadable
    }
    return peopleArray
}
const attrsToTrack = ['name@en','friendships']
const addRevisionsImpure = async function addRevisionsToPeopleArray(peopleArray){
    for(let eachPerson of peopleArray){
        for(let eachAttr in eachPerson){
            if(attrsToTrack.includes(eachAttr)) {
                const revs = await offDB.revisions.get(`${eachPerson.uid}.${eachAttr}`)
                if(revs){
                    eachPerson[`${eachAttr}|history`]=revs.revMap
                } else {
                    if(eachPerson.created){
                        const createdTS = new Date(eachPerson.created).getTime()
                        const eachVal = eachPerson[eachAttr]
                        const revMap = {[createdTS]:eachVal}
                        offDB.revisions.put({
                            revid:`${eachPerson.uid}.${eachAttr}`,
                            uid:eachPerson.uid,
                            prop:eachAttr,
                            revMap
                        })
                        eachPerson[`${eachAttr}|history`]=revMap
                    }
                }
            }
        }
    }
    return peopleArray
}

const getEveryone = async function getEveryone() {
    const everyone = await offDB.people.toArray()
    console.log(everyone.length, ' people in idb')
    if(everyone.length) {
        return everyone // await addFriendshipsImpure(everyone)
    } else {
        pendingInitPromise = deferredPromise()
        worker.postMessage(['init',{paramObject:'testing'}]) // calling a worker function with the first arg of the array as the fx name and all other array members are passed as args to the fx
        return pendingInitPromise
    }
}

const subscribeEveryone = async function subscribeEveryone(referenceToReset,propname='dataset') {
    const everyone = await offDB.people.toArray()
    if(everyone.length) {
        console.log('Friendships should show up in 2sec')
        setTimeout(async ()=>{
            console.log('Trying to set the dataset:',referenceToReset)
            referenceToReset[propname]=await addRevisionsImpure(await addFriendshipsImpure(everyone))
        },2000)
    }
}

const updateRecord = async function updateRecord(newData) {
    const modDate=new Date()
    newData.row.modified=modDate.toISOString()
    console.log('cellUpdated:', newData)

    console.log('offDB',offDB);
    
    // Dexie
    const dexVal = (await offDB.people.get(newData.row.uid)) || newData;
    console.log('current dexie record:', dexVal);

    
    // TODO create revisions in single rows (less micro managing here)
    // TODO consider data model for storing revisions in dgraph ( )
    if(newData.column.field=='name@en'){
      newData.row.name=newData.value
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

    await offDB.people.put(newData.row,newData.row.uid);
    
    if(isOffline) return // TODO only do the following dgraph mutation if client is online:
    const mu = `
      <${newData.row.uid}> <${newData.column.field}> "${newData.value}" (modified=${newData.row.modified}) .
      <${newData.row.uid}> <modified> "${newData.row.modified}" .
    `
    console.log('mutation:', mu)
    await mutateData({setNquads:mu})    
}


let pendingInitPromise // this reference is a little trick to allow the consumer of getEveryone to await the result
worker.onmessage = async function messageFromWebWorker(event) {
    console.log("message from worker", event)
    const {isOffDBready, ...otherPotentialProperties} = event.data
    if(isOffDBready) {
        console.log('offDB is ready to roll', offDB)
        console.log(await offDB.people.count(), ' people in idb')
        pendingInitPromise.resolve(await offDB.people.toArray())
    } else {
        console.warn('unknown message:', otherPotentialProperties)
    }
};

export { getEveryone, subscribeEveryone, updateRecord, offDB }