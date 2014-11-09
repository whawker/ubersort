# Ubersort

Configurable priority based sorting for arrays of complex objects.

## Built in comparators
* **text** compare as case sensitive strings
* **numeric** compare by numeric value
* *Custom* A function added with `Array.prototype.ubersort.addComparator` (See below)

## Methods
### ubersort( sortConfig )
```javascript
myArr.ubersort({ property: 'propertyName', comparator: 'text' });
```
```javascript
myArr.ubersort({
  property: 'propertyName',
  comparator: function (a, b) {
    return a - b;
  }
});
```
```javascript
myArr.ubersort([
  { property: 'nested.propertyName', comparator: 'text' },
  { property: 'otherProperty', comparator: 'numeric', reverse: true}
]);
```

#### PARAMETERS
* **sortConfig** `Array|Object` sorting options (see below)

##### Sorting options, 
Array of objects with the following properties, **or** single object with properties
```javascript
{
  property: 'String', // Name of object property to be compared, can be a nested property i.e. myObj.subObj.property
  comparator: 'String|Function', // Name of function to be used, or a function definition
  reverse: 'Boolean', // If true, sort in descending order, default false
}
```

### Array.prototype.ubersort.addComparator( name, sortDefinition )
Add a function that can later be reference by it's given name
```javascript
Array.prototype.ubersort.addComparator('nearestToMillion', function (a, b) {
  var aVal = Math.abs(a - 1000000),
      bVal = Math.abs(b - 1000000);
  return aVal - bVal;
});
myArray.ubersort({ property: 'propName', comparator: 'nearestToMillion' });
```
#### PARAMETERS
* **name** `String` name of sorting function
* **sortDefinition** `Function` a sorting function, that takes to values to be compared

## Example
The order of a football league table has many rules

<blockquote>
  <p>In the league format, the ranking in each group is determined as follows</p>
  <ol>
    <li>greatest number of points obtained in all group matches;</li>
    <li>goal difference in all group matches;</li>
    <li>greatest number of goals scored in all group matches.</li>
  </ol>
</blockquote>

The second and third rules only come into play if the previous rules yield no difference.

```javascript
var teams = [
  {name: 'Ghana', played: 3, won: 0, drawn: 1, lost: 2, gf: 4, ga: 6, gd: -2, points: 1},
  {name: 'USA', played: 3, won: 1, drawn: 1, lost: 1, gf: 4, ga: 4, gd: 0, points: 4},
  {name: 'Germany', played: 3, won: 2, drawn: 1, lost: 0, gf: 7, ga: 2, gd: 5, points: 7},
  {name: 'Portugal', played: 3, won: 1, drawn: 1, lost: 1, gf: 4, ga: 7, gd: -3, points: 4}
];

teams.ubersort([
  {property: 'points', comparator: 'numeric', reverse: true},
  {property: 'gd', comparator: 'numeric', reverse: true},
  {property: 'gf', comparator: 'numeric', reverse: true}
]);

console.log(teams);
/*
[
  {name: 'Germany', played: 3, won: 2, drawn: 1, lost: 0, gf: 7, ga: 2, gd: 5, points: 7},
  {name: 'USA', played: 3, won: 1, drawn: 1, lost: 1, gf: 4, ga: 4, gd: 0, points: 4},
  {name: 'Portugal', played: 3, won: 1, drawn: 1, lost: 1, gf: 4, ga: 7, gd: -3, points: 4},
  {name: 'Ghana', played: 3, won: 0, drawn: 1, lost: 2, gf: 4, ga: 6, gd: -2, points: 1}
]
*/
```
