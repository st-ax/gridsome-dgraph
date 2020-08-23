const convertJStypeObjectToSchemaPropList= (jsType) => {
  let retString = ''
  for(let eachKey in jsType){
    retString += `    ${eachKey}\n`
  }
  return retString
}
const convertJSDirectivesToSchemaDirectives = (directives) => {
  let retString = ''
  for(let eachKey in directives){
    retString += `${eachKey}: ${directives[eachKey]} .\n`
  }
  return retString
}

const directives = {
      name: 'string @index(term) @lang',
      created: 'datetime @index(hour)',
      modified: 'datetime @index(hour)',
      age: 'int @index(int)',
      friendships: '[uid] @count @reverse',
      owned_pets: '[uid] @count',
      owned_by: '[uid] @count',
    },
    { name,created,modified,age,friendships,owned_pets,owned_by } = directives


const PersonType = {
  name,
  created,
  modified,
  age,
  friendships,
  owned_pets,
}
const AnimalType = {
  name,
  created,
  modified,
  owned_by,
}

const schema = `
# Define Types
type Person {
${ convertJStypeObjectToSchemaPropList(PersonType)}
}

type Animal {
${ convertJStypeObjectToSchemaPropList(AnimalType)}
}

# Define Directives and index
${convertJSDirectivesToSchemaDirectives(directives)}
`
console.log(schema)
const initialDataSet =
`_:michael <name> "Michael"@en .
_:michael <dgraph.type> "Person" .
_:michael <created> "${(new Date()).toISOString()}"^^<xs:dateTime> .

_:michael <age> "39" .
_:michael <friendships> _:amit (close=true, since=2019-03-28T14:00:00-06:00) .
_:michael <friendships> _:sarah .
_:michael <friendships> _:sang .
_:michael <friendships> _:catalina .
_:michael <friendships> _:artyom .
_:michael <owned_pets> _:rammy .

_:amit <name> "अमित"@hi .
_:amit <name> "অমিত"@bn .
_:amit <name> "Amit"@en .
_:amit <dgraph.type> "Person" .
_:amit <created> "${(new Date()).toISOString()}"^^<xs:dateTime> .
_:amit <age> "35" .
_:amit <friendships> _:michael (close=false, since=2019-03-28T14:00:00-06:00) .
_:amit <friendships> _:sang .
_:amit <friendships> _:artyom .

_:luke <name> "Luke Friendless"@en .
_:luke <dgraph.type> "Person" .
_:luke <created> "${(new Date()).toISOString()}"^^<xs:dateTime> .
_:luke <name> "Łukasz Samotny"@pl .
_:luke <age> "77" .

_:artyom <name> "Артём"@ru .
_:artyom <name> "Artyom"@en .
_:artyom <dgraph.type> "Person" .
_:artyom <created> "${(new Date()).toISOString()}"^^<xs:dateTime> .
_:artyom <age> "35" .

_:sarah <name> "Sarah"@en .
_:sarah <dgraph.type> "Person" .
_:sarah <created> "${(new Date()).toISOString()}"^^<xs:dateTime> .
_:sarah <age> "55" .

_:sang <name> "상현"@ko .
_:sang <name> "Sang Hyun"@en .
_:sang <dgraph.type> "Person" .
_:sang <created> "${(new Date()).toISOString()}"^^<xs:dateTime> .
_:sang <age> "24" .
_:sang <friendships> _:amit .
_:sang <friendships> _:catalina .
_:sang <friendships> _:hyung .
_:sang <owned_pets> _:goldie .

_:hyung <name> "형신"@ko .
_:hyung <name> "Hyung Sin"@en .
_:hyung <dgraph.type> "Person" .
_:hyung <created> "${(new Date()).toISOString()}"^^<xs:dateTime> .
_:hyung <friendships> _:sang .

_:catalina <name> "Catalina"@en .
_:catalina <dgraph.type> "Person" .
_:catalina <created> "${(new Date()).toISOString()}"^^<xs:dateTime> .
_:catalina <age> "19" .
_:catalina <friendships> _:sang .
_:catalina <owned_pets> _:perro .

_:rammy <name> "Rammy the sheep"@en .
_:rammy <dgraph.type> "Animal" .
_:rammy <created> "${(new Date()).toISOString()}"^^<xs:dateTime> .

_:goldie <name> "Goldie"@en .
_:goldie <dgraph.type> "Animal" .
_:goldie <owned_by> _:sang .
_:goldie <created> "${(new Date()).toISOString()}"^^<xs:dateTime> .

_:perro <name> "Perro"@en .
_:perro <dgraph.type> "Animal" .
_:perro <owned_by> _:catalina .
_:perro <created> "${(new Date()).toISOString()}"^^<xs:dateTime> .
`
const everyoneQuery = 
`
{
    everyone(func: eq(dgraph.type, "Person")) {
        uid
        age
        created as created
        modified
        seconds_since_created: math(since(created))
        name: name@.
        name@* @facets
        friendships_outgoing: count(friendships)
        friendships_incoming: count(~friendships)
        friendships @facets {
          uid
          name@* @facets
        }
      }
}
`
module.exports = { schema, initialDataSet, everyoneQuery }