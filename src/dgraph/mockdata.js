const schema = `
# Define Types

type Person {
    name
    created
    modified
    age
    friendship
    owns_pet
}

type Animal {
    name
}

# Define Directives and index

name: string @index(term) @lang .
created: datetime @index(hour) .
modified: datetime @index(hour) .
age: int @index(int) .
friendship: [uid] @count @reverse .
owns_pet: [uid] .

`
const initialDataSet =
`_:michael <name> "Michael"@en .
_:michael <dgraph.type> "Person" .
_:michael <created> "${(new Date()).toISOString()}"^^<xs:dateTime> .

_:michael <age> "39" .
_:michael <friendship> _:amit (close=true, since=2019-03-28T14:00:00-06:00) .
_:michael <friendship> _:sarah .
_:michael <friendship> _:sang .
_:michael <friendship> _:catalina .
_:michael <friendship> _:artyom .
_:michael <owns_pet> _:rammy .

_:amit <name> "अमित"@hi .
_:amit <name> "অমিত"@bn .
_:amit <name> "Amit"@en .
_:amit <dgraph.type> "Person" .
_:amit <created> "${(new Date()).toISOString()}"^^<xs:dateTime> .
_:amit <age> "35" .
_:amit <friendship> _:michael (close=false, since=2019-03-28T14:00:00-06:00) .
_:amit <friendship> _:sang .
_:amit <friendship> _:artyom .

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
_:sang <friendship> _:amit .
_:sang <friendship> _:catalina .
_:sang <friendship> _:hyung .
_:sang <owns_pet> _:goldie .

_:hyung <name> "형신"@ko .
_:hyung <name> "Hyung Sin"@en .
_:hyung <dgraph.type> "Person" .
_:hyung <created> "${(new Date()).toISOString()}"^^<xs:dateTime> .
_:hyung <friendship> _:sang .

_:catalina <name> "Catalina"@en .
_:catalina <dgraph.type> "Person" .
_:catalina <created> "${(new Date()).toISOString()}"^^<xs:dateTime> .
_:catalina <age> "19" .
_:catalina <friendship> _:sang .
_:catalina <owns_pet> _:perro .

_:rammy <name> "Rammy the sheep"@en .
_:rammy <dgraph.type> "Animal" .
_:rammy <created> "${(new Date()).toISOString()}"^^<xs:dateTime> .

_:goldie <name> "Goldie"@en .
_:goldie <dgraph.type> "Animal" .
_:goldie <created> "${(new Date()).toISOString()}"^^<xs:dateTime> .

_:perro <name> "Perro"@en .
_:perro <dgraph.type> "Animal" .
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
        name: name@. @facets
        name@* @facets
        friendships_outgoing: count(friendship)
        friendships_incoming: count(~friendship)
        friendship @facets {
          uid
          name@* @facets
        }
      }
}
`
module.exports = { schema, initialDataSet, everyoneQuery }