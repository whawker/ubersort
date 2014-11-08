define(function (require) {
    'use strict';

    require('ubersort');

    describe('Ubersort', function () {
        it('should provide an Array.prototype method `ubersort`', function () {
            expect(Array.prototype.ubersort).toBeDefined();
        });

        describe('comparators', function () {
            describe('text', function() {
                it('should providing a default comparator `text`', function () {
                    expect(Array.prototype.ubersort.comparators.text).toEqual(jasmine.any(Function));
                });

                it('should return a negative number if first arg is less than second', function () {
                    expect(Array.prototype.ubersort.comparators.text('a', 'b')).toBeLessThan(0);
                });

                it('should return zero if arguments are equal', function () {
                    expect(Array.prototype.ubersort.comparators.text('a', 'a')).toBe(0);
                });

                it('should return a positive number if first arg is greater than second', function () {
                    expect(Array.prototype.ubersort.comparators.text('b', 'a')).toBeGreaterThan(0);
                });
            });

            describe('numeric', function() {
                it('should providing a default comparator `numeric`', function () {
                    expect(Array.prototype.ubersort.comparators.numeric).toEqual(jasmine.any(Function));
                });

                it('should return a negative number if first arg is less than second', function () {
                    expect(Array.prototype.ubersort.comparators.numeric(20, 100)).toBeLessThan(0);
                });

                it('should return zero if arguments are equal', function () {
                    expect(Array.prototype.ubersort.comparators.numeric(20, 20)).toBe(0);
                });

                it('should return a positive number if first arg is greater than second', function () {
                    expect(Array.prototype.ubersort.comparators.numeric(100, 20)).toBeGreaterThan(0);
                });
            });
        });

        describe('addComparator', function () {
            beforeEach(function () {
                Array.prototype.ubersort.addComparator('nearestToMillion', function (a, b) {
                    var aVal = Math.abs(a - 1000000),
                        bVal = Math.abs(b - 1000000);
                    return aVal - bVal;
                });
            });

            it('should have added custom comparator', function () {
                expect(Array.prototype.ubersort.comparators.nearestToMillion).toBeDefined();
            });

            it('should sort by custom comparator by given name', function () {
                var values = [
                    {val: 6000}, {val: 9991000}, {val: 1000200},
                    {val: 900000}, {val: 1}, {val: 4000}
                ];
                values.ubersort({property: 'val', comparator: 'nearestToMillion'});
                expect(values).toEqual([
                    {val: 1000200}, {val: 900000}, {val: 6000},
                    {val: 4000}, {val: 1}, {val: 9991000}
                ]);
            });
        });

        describe('sorting', function () {
            var towns,
                values,
                league,
                companies;
            beforeEach(function () {
                towns = [
                    {name: 'Guildford'}, {name: 'Port Talbot'}, {name: 'Tamworth'},
                    {name: 'Oldham'}, {name: 'Croydon'}, {name: 'Surbiton'}
                ];
                values = [
                    {val: 6000}, {val: 9991000}, {val: 1000200},
                    {val: 900000}, {val: 1}, {val: 4000}
                ];
                league = [
                    {name: 'Arsenal', played: 10, won: 4, drawn: 5, lost: 1, goalsFor: 18, goalsAgainst: 11, goalDifference: 7, points: 17},
                    {name: 'Aston Villa', played: 10, won: 3, drawn: 1, lost: 6, goalsFor: 5, goalsAgainst: 16, goalDifference: -11, points: 10},
                    {name: 'Burnley', played: 10, won: 0, drawn: 4, lost: 6, goalsFor: 5, goalsAgainst: 19, goalDifference: -14, points: 4},
                    {name: 'Chelsea', played: 10, won: 8, drawn: 2, lost: 0, goalsFor: 26, goalsAgainst: 10, goalDifference: 16, points: 26},
                    {name: 'Crystal Palace', played: 10, won: 2, drawn: 3, lost: 5, goalsFor: 14, goalsAgainst: 19, goalDifference: -5, points: 9},
                    {name: 'Everton', played: 10, won: 3, drawn: 4, lost: 3, goalsFor: 19, goalsAgainst: 17, goalDifference: 2, points: 13},
                    {name: 'Hull City', played: 10, won: 2, drawn: 5, lost: 3, goalsFor: 13, goalsAgainst: 14, goalDifference: -1, points: 11},
                    {name: 'Leicester City', played: 10, won: 2, drawn: 3, lost: 5, goalsFor: 11, goalsAgainst: 16, goalDifference: -5, points: 9},
                    {name: 'Liverpool', played: 10, won: 4, drawn: 2, lost: 4, goalsFor: 13, goalsAgainst: 13, goalDifference: 0, points: 14},
                    {name: 'Manchester City', played: 10, won: 6, drawn: 2, lost: 2, goalsFor: 20, goalsAgainst: 10, goalDifference: 10, points: 20},
                    {name: 'Manchester United', played: 10, won: 3, drawn: 4, lost: 3, goalsFor: 16, goalsAgainst: 14, goalDifference: 2, points: 13},
                    {name: 'Newcastle United', played: 10, won: 3, drawn: 4, lost: 3, goalsFor: 11, goalsAgainst: 15, goalDifference: -4, points: 13},
                    {name: 'Queens Park Rangers', played: 10, won: 2, drawn: 1, lost: 7, goalsFor: 9, goalsAgainst: 20, goalDifference: -11, points: 7},
                    {name: 'Southampton', played: 10, won: 7, drawn: 1, lost: 2, goalsFor: 21, goalsAgainst: 5, goalDifference: 16, points: 22},
                    {name: 'Stoke City', played: 10, won: 3, drawn: 3, lost: 4, goalsFor: 10, goalsAgainst: 12, goalDifference: -2, points: 12},
                    {name: 'Sunderland', played: 10, won: 2, drawn: 5, lost: 3, goalsFor: 11, goalsAgainst: 18, goalDifference: -7, points: 11},
                    {name: 'Swansea City', played: 10, won: 4, drawn: 3, lost: 3, goalsFor: 13, goalsAgainst: 10, goalDifference: 3, points: 15},
                    {name: 'Tottenham Hotspur', played: 10, won: 4, drawn: 2, lost: 4, goalsFor: 13, goalsAgainst: 14, goalDifference: -1, points: 14},
                    {name: 'West Bromwich Albion', played: 10, won: 3, drawn: 4, lost: 3, goalsFor: 13, goalsAgainst: 13, goalDifference: 0, points: 13},
                    {name: 'West Ham United', played: 10, won: 5, drawn: 2, lost: 3, goalsFor: 19, goalsAgainst: 14, goalDifference: 5, points: 17}
                ];
                companies = [
                    {name: 'Tesco', sharePrice: {val: 600, change: -1}},
                    {name: 'Sainsburys', sharePrice: {val: 400, change: 5}},
                    {name: 'Asda', sharePrice: {val: 600, change: 3}},
                    {name: 'Lidl', sharePrice: {val: 500, change: 10}}
                ];
            });

            it('should order properties by named comparators', function () {
                towns.ubersort({property: 'name', comparator: 'text'});
                expect(towns).toEqual([
                    {name: 'Croydon'}, {name: 'Guildford'}, {name: 'Oldham'},
                    {name: 'Port Talbot'}, {name: 'Surbiton'}, {name: 'Tamworth'}
                ]);
            });

            it('should let comparators be defined as functions', function () {
                towns.ubersort({
                    property: 'name',
                    comparator: function (a, b) {
                        if (a === b) {
                            return 0;
                        }
                        return ((a > b) ? 1 : -1);
                    },
                    reverse: true
                });
                expect(towns).toEqual([
                    {name: 'Tamworth'}, {name: 'Surbiton'}, {name: 'Port Talbot'},
                    {name: 'Oldham'}, {name: 'Guildford'}, {name: 'Croydon'}
                ]);
            });

            it('should order reverse order properties if reverse = true', function () {
                towns.ubersort({property: 'name', comparator: 'text', reverse: true});
                expect(towns).toEqual([
                    {name: 'Tamworth'}, {name: 'Surbiton'}, {name: 'Port Talbot'},
                    {name: 'Oldham'}, {name: 'Guildford'}, {name: 'Croydon'}
                ]);
            });

            it('should order by multiple properties in priority order', function () {
                var leagueRules = [
                    {property: 'points', comparator: 'numeric', reverse: true},
                    {property: 'goalDifference', comparator: 'numeric', reverse: true},
                    {property: 'goalsFor', comparator: 'numeric', reverse: true},
                    {property: 'name', comparator: 'text'}
                ];
                league.ubersort(leagueRules);

                expect(league).toEqual([
                    {name: 'Chelsea', played: 10, won: 8, drawn: 2, lost: 0, goalsFor: 26, goalsAgainst: 10, goalDifference: 16, points: 26},
                    {name: 'Southampton', played: 10, won: 7, drawn: 1, lost: 2, goalsFor: 21, goalsAgainst: 5, goalDifference: 16, points: 22},
                    {name: 'Manchester City', played: 10, won: 6, drawn: 2, lost: 2, goalsFor: 20, goalsAgainst: 10, goalDifference: 10, points: 20},
                    {name: 'Arsenal', played: 10, won: 4, drawn: 5, lost: 1, goalsFor: 18, goalsAgainst: 11, goalDifference: 7, points: 17},
                    {name: 'West Ham United', played: 10, won: 5, drawn: 2, lost: 3, goalsFor: 19, goalsAgainst: 14, goalDifference: 5, points: 17},
                    {name: 'Swansea City', played: 10, won: 4, drawn: 3, lost: 3, goalsFor: 13, goalsAgainst: 10, goalDifference: 3, points: 15},
                    {name: 'Liverpool', played: 10, won: 4, drawn: 2, lost: 4, goalsFor: 13, goalsAgainst: 13, goalDifference: 0, points: 14},
                    {name: 'Tottenham Hotspur', played: 10, won: 4, drawn: 2, lost: 4, goalsFor: 13, goalsAgainst: 14, goalDifference: -1, points: 14},
                    {name: 'Everton', played: 10, won: 3, drawn: 4, lost: 3, goalsFor: 19, goalsAgainst: 17, goalDifference: 2, points: 13},
                    {name: 'Manchester United', played: 10, won: 3, drawn: 4, lost: 3, goalsFor: 16, goalsAgainst: 14, goalDifference: 2, points: 13},
                    {name: 'West Bromwich Albion', played: 10, won: 3, drawn: 4, lost: 3, goalsFor: 13, goalsAgainst: 13, goalDifference: 0, points: 13},
                    {name: 'Newcastle United', played: 10, won: 3, drawn: 4, lost: 3, goalsFor: 11, goalsAgainst: 15, goalDifference: -4, points: 13},
                    {name: 'Stoke City', played: 10, won: 3, drawn: 3, lost: 4, goalsFor: 10, goalsAgainst: 12, goalDifference: -2, points: 12},
                    {name: 'Hull City', played: 10, won: 2, drawn: 5, lost: 3, goalsFor: 13, goalsAgainst: 14, goalDifference: -1, points: 11},
                    {name: 'Sunderland', played: 10, won: 2, drawn: 5, lost: 3, goalsFor: 11, goalsAgainst: 18, goalDifference: -7, points: 11},
                    {name: 'Aston Villa', played: 10, won: 3, drawn: 1, lost: 6, goalsFor: 5, goalsAgainst: 16, goalDifference: -11, points: 10},
                    {name: 'Crystal Palace', played: 10, won: 2, drawn: 3, lost: 5, goalsFor: 14, goalsAgainst: 19, goalDifference: -5, points: 9},
                    {name: 'Leicester City', played: 10, won: 2, drawn: 3, lost: 5, goalsFor: 11, goalsAgainst: 16, goalDifference: -5, points: 9},
                    {name: 'Queens Park Rangers', played: 10, won: 2, drawn: 1, lost: 7, goalsFor: 9, goalsAgainst: 20, goalDifference: -11, points: 7},
                    {name: 'Burnley', played: 10, won: 0, drawn: 4, lost: 6, goalsFor: 5, goalsAgainst: 19, goalDifference: -14, points: 4}
                ]);
            });

            it('should sort by nested properties', function () {
                companies.ubersort([{property: 'sharePrice.change', comparator: 'numeric', reverse: true}]);
                expect(companies).toEqual([
                    {name: 'Lidl', sharePrice: {val: 500, change: 10}},
                    {name: 'Sainsburys', sharePrice: {val: 400, change: 5}},
                    {name: 'Asda', sharePrice: {val: 600, change: 3}},
                    {name: 'Tesco', sharePrice: {val: 600, change: -1}}
                ]);
            });
        });

        describe('Errors', function () {
            var arr;
            beforeEach(function () {
                arr = [{val: 3}, {val: 4}];
            });

            it('should throw an error if no sorting config is supplied', function () {
                var err = new Error('Config not supplied');
                expect(function () { arr.ubersort(); }).toThrow(err);
            });

            it('should throw an error if no property is supplied', function () {
                var err = new Error('Insufficient data for sorting, require property');
                expect(function () { arr.ubersort({comparator: 'numeric'}); }).toThrow(err);
            });

            it('should throw an error if no property is supplied', function () {
                var err = new Error('Insufficient data for sorting, require comparison function');
                expect(function () { arr.ubersort({property: 'val'}); }).toThrow(err);
            });

            it('should throw an error if named comparator does not exist', function () {
                var err = new Error('Unknown comparator: regex');
                expect(function () { arr.ubersort({property: 'val', comparator: 'regex'}); }).toThrow(err);
            });

            it('should throw an error if given comparator is not a function', function () {
                var err = new Error('Comparator is not a function: [object Object]');
                expect(function () { arr.ubersort({property: 'val', comparator: {}}); }).toThrow(err);
            });
        });
    });
});
