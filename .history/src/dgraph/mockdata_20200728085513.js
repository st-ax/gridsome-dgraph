const schema = `
# Define Types

type Person {
    name
    age
    friendship
    owns_pet
}

type Animal {
    name
}

# Define Directives and index

name: string @index(term) @lang .
age: int @index(int) .
friendship: [uid] @count .
owns_pet: [uid] .

`
const initialDataSet =
`_:michael <name> "Michael" .
_:michael <dgraph.type> "Person" .
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
_:amit <age> "35" .
_:amit <friendship> _:michael (close=false, since=2019-03-28T14:00:00-06:00) .
_:amit <friendship> _:sang .
_:amit <friendship> _:artyom .

_:luke <name> "Luke"@en .
_:luke <dgraph.type> "Person" .
_:luke <name> "Łukasz"@pl .
_:luke <age> "77" .

_:artyom <name> "Артём"@ru .
_:artyom <name> "Artyom"@en .
_:artyom <dgraph.type> "Person" .
_:artyom <age> "35" .

_:sarah <name> "Sarah" .
_:sarah <dgraph.type> "Person" .
_:sarah <age> "55" .

_:sang <name> "상현"@ko .
_:sang <name> "Sang Hyun"@en .
_:sang <dgraph.type> "Person" .
_:sang <age> "24" .
_:sang <friendship> _:amit .
_:sang <friendship> _:catalina .
_:sang <friendship> _:hyung .
_:sang <owns_pet> _:goldie .

_:hyung <name> "형신"@ko .
_:hyung <name> "Hyung Sin"@en .
_:hyung <dgraph.type> "Person" .
_:hyung <friendship> _:sang .

_:catalina <name> "Catalina" .
_:catalina <dgraph.type> "Person" .
_:catalina <age> "19" .
_:catalina <friendship> _:sang .
_:catalina <owns_pet> _:perro .

_:rammy <name> "Rammy the sheep" .
_:rammy <dgraph.type> "Animal" .

_:goldie <name> "Goldie" .
_:goldie <dgraph.type> "Animal" .

_:perro <name> "Perro" .
_:perro <dgraph.type> "Animal" .
`
const everyoneQuery = 
`
{
    everyone(func: eq(dgraph.type, "Person")) {
        uid
        name: name@. @facets
        friendship @facets {
            uid
            name: name@. @facets   
            friendship @facets 
        }
    }
}
`
module.exports = { schema, initialDataSet, everyoneQuery }