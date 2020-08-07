import {offDB} from './offline.js'
import { deferredPromise } from '../utils/async.js'

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
const addRevisionsImpure = async function addRevisionsToPeopleArray(peopleArray){
    for(let eachPerson of peopleArray){
        for(let eachAttr in eachPerson){
            const revs = await offDB.revisions.get(`${eachPerson.uid}.${eachAttr}`)
            if(revs){
                eachPerson[`${eachAttr}|history`]=revs.revMap
            }
        }
    }
    return peopleArray
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


const getEveryone = async function getEveryone() {
    const everyone = await offDB.people.toArray()
    console.log(everyone.length, ' people in idb')
    if(everyone.length) {
        return everyone // await addFriendshipsImpure(everyone)
    } else {
        pendingInitPromise = deferredPromise()
        worker.postMessage(['init',{foo:'bar'}]) // calling a worker function with the first arg of the array as the fx name and all other array members are passed as args to the fx
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


export { getEveryone, subscribeEveryone, offDB }