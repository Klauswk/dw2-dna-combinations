angular.module("dw2DnaCombinations").controller("mainController", function ($scope, $http) {

    var parseDataTable = function (data) {
        let csvData = [];
        let lbreak = data.split("\n");
        lbreak.forEach(res => {
            csvData.push(res.split("|"));
        });

        return csvData;
    };


    var loadCCDnaTable = function () {
        return parseDataTable(ccDnaChart);
    }

    var loadUUDnaTable = function () {
        return parseDataTable(uuDnaChart);
    }

    var loadMMDnaTable = function () {
        return parseDataTable(mmDnaChart);
    }

    var loadRookieDnaChart = function () {
        var rookieRawArray = parseDataTable(rookieDnaChart);

        var rookieArray = rookieRawArray.map(row => {
            return { name: row[0], stage: 1, cc: row[1], digivolution: [] };
        });

        return rookieArray;
    }

    var loadChampionDnaChart = function () {
        var championRawArray = parseDataTable(championDnaChart);

        var championArray = championRawArray.map(row => {
            return { name: row[0], stage: 2, cc: row[1], uc: row[2], digivolution: row.slice(3).filter(v => v !== "") };
        });

        return championArray;
    }

    var loadUltimateDnaChart = function () {
        var ultimateRawArray = parseDataTable(ultimateDnaChart);

        var ultimateArray = ultimateRawArray.map(row => {
            return { name: row[0], stage: 3, uc: row[1], mc: row[2], digivolution: row.slice(3).filter(v => v !== "") };
        });

        return ultimateArray;
    }

    var loadMegaDnaChart = function () {
        var megaRawArray = parseDataTable(megaDnaChart);

        var megaArray = megaRawArray.map(row => {
            return { name: row[0], stage: 4, mc: row[1], digivolution: row.slice(2).filter(v => v !== "") };
        });

        return megaArray;
    }

    var sortByName = function (a, b) {
        if (a.first.name < b.first.name) {
            return -1;
        }
        if (a.first.name > b.first.name) {
            return 1;
        }

        return 0;
    }

    var sortByChildName = function (a, b) {
        if (a.childDigimon.name < b.childDigimon.name) {
            return -1;
        }
        if (a.childDigimon.name > b.childDigimon.name) {
            return 1;
        }

        return 0;
    }

    var sortBySecondParentName = function (a, b) {
        if (a.name < b.name) {
            return -1;
        }
        if (a.name > b.name) {
            return 1;
        }

        return 0;
    }

    var ccDnaTable = loadCCDnaTable();

    var uuDnaTable = loadUUDnaTable();

    var mmDnaTable = loadMMDnaTable();

    var rookieArray = loadRookieDnaChart();

    var championArray = loadChampionDnaChart();

    var ultimateArray = loadUltimateDnaChart();

    var megaArray = loadMegaDnaChart();

    var search = function (digimon) {
        var rookie = rookieArray.find(rookie => rookie.name.toLowerCase() === digimon.name.toLowerCase());

        if (rookie) {
            return rookie;
        }

        var champion = championArray.find(champion => champion.name.toLowerCase() === digimon.name.toLowerCase());

        if (champion) {
            return champion;
        }

        var ultimate = ultimateArray.find(ultimate => ultimate.name.toLowerCase() === digimon.name.toLowerCase());

        if (ultimate) {
            return ultimate;
        }

        var mega = megaArray.find(mega => mega.name.toLowerCase() === digimon.name.toLowerCase());

        if (mega) {
            return mega;
        }

        return null;
    };

    var findCCCombination = function (indexes) {

        var arrayCombination = [];

        indexes.forEach(index => {
            championArray.forEach(rowDigimon => {
                if (rowDigimon.cc === index.row) {

                    championArray.forEach(columnDigimon => {
                        if (columnDigimon.cc === index.column) {
                            arrayCombination.push({ first: rowDigimon, second: columnDigimon });
                        }
                    });
                }
            });
        });

        return arrayCombination;
    }

    var findUUCombination = function (indexes) {

        var arrayCombination = [];

        indexes.forEach(index => {
            ultimateArray.forEach(rowDigimon => {
                if (rowDigimon.uc === index.row) {

                    ultimateArray.forEach(columnDigimon => {
                        if (columnDigimon.uc === index.column) {
                            arrayCombination.push({ first: rowDigimon, second: columnDigimon });
                        }
                    });
                }
            });
        });

        return arrayCombination;
    }

    var findMMCombination = function (indexes) {

        var arrayCombination = [];

        indexes.forEach(index => {
            megaArray.forEach(rowDigimon => {
                if (rowDigimon.mc === index.row) {

                    megaArray.forEach(columnDigimon => {
                        if (columnDigimon.mc === index.column) {
                            arrayCombination.push({ first: rowDigimon, second: columnDigimon });
                        }
                    });
                }
            });
        });

        return arrayCombination;
    }

    var findDigimonDataForRookieChildAndChampionParents = function(childDigimonAndSecondParentSet) {
        var combinationsFromDigimon = [];
        childDigimonAndSecondParentSet.forEach(otherParentAndChild => {
            var resultingDigimon = null;
            var secondParentsAsDigimonObjects = [];
            rookieArray.forEach(possibleResultingDigimon => {
                if (otherParentAndChild.childDigiID === possibleResultingDigimon.cc) {
                    resultingDigimon = possibleResultingDigimon;
                }
            });
            otherParentAndChild.secondParents.forEach(secondParent => {
                championArray.forEach(possibleSecondParent => {
                    if (secondParent === possibleSecondParent.cc) {
                        secondParentsAsDigimonObjects.push(possibleSecondParent);
                    }
                });
            });

            secondParentsAsDigimonObjects.sort(sortBySecondParentName);

            combinationsFromDigimon.push({
                childDigimon: resultingDigimon,
                secondParents: secondParentsAsDigimonObjects
            });


        });

        return combinationsFromDigimon;
    }

    var findDigimonDataForChampionChildAndUltimateParents = function (childDigimonAndSecondParentSet) {
        var combinationsFromDigimon = [];
        childDigimonAndSecondParentSet.forEach(otherParentAndChild => {
            var resultingDigimon = null;
            var secondParentsAsDigimonObjects = [];
            if (otherParentAndChild.childDigiID.charAt(0) === "M") {
                if (otherParentAndChild.childDigiID === "MA") {
                    resultingDigimon = search({ name: "Vademon" });
                }
            } else {
                championArray.forEach(possibleResultingDigimon => {
                    if (otherParentAndChild.childDigiID === possibleResultingDigimon.uc) {
                        resultingDigimon = possibleResultingDigimon;
                    }
                });
            }
            
            otherParentAndChild.secondParents.forEach(secondParent => {
                ultimateArray.forEach(possibleSecondParent => {
                    if (secondParent === possibleSecondParent.uc) {
                        secondParentsAsDigimonObjects.push(possibleSecondParent);
                    }
                });
            });

            secondParentsAsDigimonObjects.sort(sortBySecondParentName);

            combinationsFromDigimon.push({
                childDigimon: resultingDigimon,
                secondParents: secondParentsAsDigimonObjects
            });


        });

        return combinationsFromDigimon;
    }

    var findDigimonDataForUltimateChildAndMegaParents = function (childDigimonAndSecondParentSet) {
        var combinationsFromDigimon = [];
        childDigimonAndSecondParentSet.forEach(otherParentAndChild => {
            var resultingDigimon = null;
            var secondParentsAsDigimonObjects = [];
            if (otherParentAndChild.childDigiID.charAt(0) === "M") {
                if (otherParentAndChild.childDigiID === "MB") {
                    resultingDigimon = search({ name: "SandYanmamon" });
                }
                if (otherParentAndChild.childDigiID === "MC") {
                    resultingDigimon = search({ name: "Yanmamon" });
                }
            } else {
                ultimateArray.forEach(possibleResultingDigimon => {
                    if (otherParentAndChild.childDigiID === possibleResultingDigimon.mc) {
                        resultingDigimon = possibleResultingDigimon;
                    }
                });
            }
            otherParentAndChild.secondParents.forEach(secondParent => {
                megaArray.forEach(possibleSecondParent => {
                    if (secondParent === possibleSecondParent.mc) {
                        secondParentsAsDigimonObjects.push(possibleSecondParent);
                    }
                });
            });

            secondParentsAsDigimonObjects.sort(sortBySecondParentName);

            combinationsFromDigimon.push({
                childDigimon: resultingDigimon,
                secondParents: secondParentsAsDigimonObjects
            });
        });

        return combinationsFromDigimon;
    }

    var searchInTable = function (dnaTable, code) {
        var indexes = [];

        dnaTable.forEach((row, rowNumb) => {
            row.forEach((column, columnNumb) => {
                if (column === code) {
                    indexes.push({ row: String.fromCharCode(65 + rowNumb), column: String.fromCharCode(65 + columnNumb) });
                }
            });
        });

        return indexes;
    }

    var searchForDNAPartners = function (dnaTable, code) {
        var dnaCombinations = [];
        var codeAsColumnNum = code.charCodeAt(0) - 65;
        console.log("Code:", code);
        dnaTable[codeAsColumnNum].forEach((row, rowNumb) => {
            var rowLetter = String.fromCharCode(65 + rowNumb);

            //The dnaTable has an extra row for some reason, may look into it later.
            if (row !== "") {
                var entryInCombinations = dnaCombinations.find(k => k.childDigiID === row);
                if (entryInCombinations === undefined || entryInCombinations === null) {
                    dnaCombinations.push({ childDigiID: row, secondParents: [rowLetter] });
                } else {
                    entryInCombinations.secondParents.push(rowLetter);
                }
            }

        });

        return dnaCombinations;
    }


    var searchTargetDigimon = (digimon) => {
        $scope.result = {};

        var digimonByName = search(digimon);

        console.log("DigimonByName: ", digimonByName);

        if (digimonByName) {
            if (digimonByName.stage === 1) {
                var result = searchInTable(ccDnaTable, digimonByName.cc);

                var combinations = findCCCombination(result);

                combinations.sort(sortByName);

                $scope.result.combinationsToGetDigimon = combinations;
            }

            if (digimonByName.stage === 2) {
                var result = searchInTable(uuDnaTable, digimonByName.uc);

                var combinations = findUUCombination(result);

                if (digimonByName.name === "Yanmamon") {
                    combinations.push({ first: { name: "H-Kabuterimon" }, second: { name: "Gryphonmon" } });
                    combinations.push({ first: { name: "H-Kabuterimon" }, second: { name: "Rosemon" } });
                }

                if (digimonByName.name === "SandYanmamon") {
                    combinations.push({ first: { name: "H-Kabuterimon" }, second: { name: "Baihumon" } });
                    combinations.push({ first: { name: "H-Kabuterimon" }, second: { name: "M-Garurumon" } });
                    combinations.push({ first: { name: "H-Kabuterimon" }, second: { name: "P-Mamemon" } });
                    combinations.push({ first: { name: "H-Kabuterimon" }, second: { name: "SaberLeomon" } });
                }

                combinations.sort(sortByName);

                $scope.result.combinationsToGetDigimon = combinations;
                $scope.result.digivolution = digimonByName.digivolution;
            }

            if (digimonByName.stage === 3) {
                var result = searchInTable(mmDnaTable, digimonByName.mc);

                var combinations = findMMCombination(result);

                if (digimonByName.name === "Vademon") {
                    combinations.push({ first: { name: "M-Tyrannomon" }, second: { name: "Cherrymon" } });
                    combinations.push({ first: { name: "MetalGreymon" }, second: { name: "Cherrymon" } });
                    combinations.push({ first: { name: "Whamon" }, second: { name: "Cherrymon" } });
                    combinations.push({ first: { name: "Zudomon" }, second: { name: "Cherrymon" } });
                }

                combinations.sort(sortByName);

                $scope.result.combinationsToGetDigimon = combinations;
                $scope.result.digivolution = digimonByName.digivolution;
            }

            if (digimonByName.stage === 4) {
                $scope.result.digivolution = digimonByName.digivolution;
                $scope.result.combinationsToGetDigimon = [{ first: { name: "Can't combine mega to get other mega" }, second: { name: "" } }];
            }
        }
    };

    var searchResultingDigimon = (digimon) => {
        $scope.result = {};

        var digimonByName = search(digimon);
        console.log("DigimonByName: ", digimonByName);
        
        var dnaTable;
        var firstParentID;
        var combinationsFromDigimon = null;

        if (digimonByName.stage === 1) {
            //Is Rookie, can't DNA Digivolve
        }
        else if (digimonByName.stage === 2) {
            dnaTable = ccDnaTable;
            firstParentID = digimonByName.cc;
            var resultStage2 = searchForDNAPartners(dnaTable, firstParentID);

            combinationsFromDigimon =
                findDigimonDataForRookieChildAndChampionParents(resultStage2);
        }
        else if (digimonByName.stage === 3) {
            dnaTable = uuDnaTable;
            firstParentID = digimonByName.uc;
            var resultStage3 = searchForDNAPartners(dnaTable, firstParentID);

            combinationsFromDigimon =
                findDigimonDataForChampionChildAndUltimateParents(resultStage3);
        }
        else if (digimonByName.stage === 4) {
            dnaTable = mmDnaTable;
            firstParentID = digimonByName.mc;
            var resultStage4 = searchForDNAPartners(dnaTable, firstParentID);

            combinationsFromDigimon =
                findDigimonDataForUltimateChildAndMegaParents(resultStage4);

        }

        if (combinationsFromDigimon !== null && combinationsFromDigimon !== undefined) {
            combinationsFromDigimon.sort(sortByChildName);
            $scope.result.combinationsFromDigimon = { firstParent : digimon.name, results: combinationsFromDigimon};
        }
    }

    var checkForTargetDigimonEnter = (event) => {
        if( event.keyCode == 13 || event.which == 13 ) {
            searchTargetDigimon($scope.targetDigimon);
        }
    }

    var checkForResultingDigimonEnter = (event) => {
        if (event.keyCode == 13 || event.which == 13) {
            searchResultingDigimon($scope.resultingDigimon);
        }
    }

    var calculateEl = (elCalculator) => {
        var highest, lowest;

        if(elCalculator.elOne >= elCalculator.elTwo) {
            highest = elCalculator.elOne;
            lowest = elCalculator.elTwo;
        } else {
            highest = elCalculator.elTwo;
            lowest = elCalculator.elOne;
        }

        elCalculator.result = Math.floor(highest + (lowest / 5));
    }

    $scope.result = {};

    $scope.searchTargetDigimon = searchTargetDigimon;

    $scope.searchResultingDigimon = searchResultingDigimon;

    $scope.checkForTargetDigimonEnter = checkForTargetDigimonEnter;

    $scope.checkForResultingDigimonEnter = checkForResultingDigimonEnter;

    $scope.calculateEl = calculateEl;

    $scope.elCalculator = {
        elOne: 0,
        elTwo: 0,
        result: 0,
    };

});

var ccDnaChart = 
`AA|AJ|AI|AA|AF|AJ|DC|DD|DH|DC|DE|DD|DC|DB|AA|AI|AA|AF|AH|AA|AE|
AJ|AB|AB|AB|AB|AH|DD|DD|DD|DD|DD|DD|DD|DG|AJ|AB|AB|AB|AH|AB|AH|
AI|AB|AC|AD|AI|AH|DH|DD|DH|DB|DH|DD|DF|DG|AI|AC|AD|AI|AH|AF|AH|
AA|AB|AD|AD|AG|AD|DC|DD|DB|DB|DF|DB|DB|DB|AA|AD|AD|AG|AD|AE|AE|
AF|AB|AI|AG|AG|AH|DD|DD|DH|DF|DE|DD|DF|DE|AF|AI|AG|AG|AH|AF|AG|
AJ|AH|AH|AD|AH|AH|DD|DD|DD|DB|DD|DD|DA|DD|AH|AH|AD|AH|AH|AH|AH|
DC|DD|DH|DC|DD|DD|DC|DD|DH|DC|DE|DD|DC|DB|IA|IM|IE|IF|IH|IE|IJ|
DD|DD|DD|DD|DD|DD|DD|DD|DD|DD|DD|DD|DD|DG|IC|IC|IC|IC|IH|IC|II|
DH|DD|DH|DB|DH|DD|DH|DD|DH|DB|DH|DD|DF|DG|IM|IB|IJ|ID|IH|IK|II|
DC|DD|DB|DB|DF|DB|DC|DD|DB|DB|DF|DB|DB|DB|IE|IJ|IL|IK|IL|IL|IJ|
DE|DD|DH|DF|DE|DD|DE|DD|DH|DF|DE|DD|DF|DE|IF|ID|IK|IF|IH|IK|IF|
DD|DD|DD|DB|DD|DD|DD|DD|DD|DB|DD|DD|DA|DD|IH|IH|IL|IH|IH|IG|IH|
DC|DD|DF|DB|DF|DB|DC|DD|DF|DB|DF|DA|DA|DA|IE|IK|IL|IK|IG|IG|IG|
DB|DG|DG|DB|DE|DD|DB|DG|DG|DB|DE|DD|DA|DG|IJ|II|IJ|IF|IH|IG|II|
AA|AJ|AI|AA|AF|AH|IA|IC|IM|IE|IF|IH|IE|IJ|IA|IM|IE|IF|IH|IE|IJ|
AI|AB|AC|AD|AI|AH|IM|IC|IB|IJ|ID|IH|IK|II|IM|IB|IJ|ID|IH|IK|II|
AA|AB|AD|AD|AG|AD|IE|IC|IJ|IL|IK|IL|IL|IJ|IE|IJ|IJ|ID|IH|IK|II|
AF|AB|AI|AG|AG|AH|IF|IC|ID|IK|IF|IH|IK|IF|IF|ID|ID|IF|IH|IK|IF|
AH|AH|AH|AD|AH|AH|IH|IH|IH|IL|IH|IH|IG|IH|IH|IH|IH|IH|IH|IG|IH|
AA|AB|AF|AE|AF|AH|IE|IC|IK|IL|IK|IG|IG|IG|IE|IK|IK|IK|IG|IG|IG|
AE|AH|AH|AE|AG|AH|IJ|II|II|IJ|IF|IH|IG|II|IJ|II|II|IF|IH|IG|II|`;

var uuDnaChart =
`AD|AU|AQ|AU|AM|AA|DV|DI|DJ|DI|DA|DJ|DA|AM|AA|AA|AQ|AU|AU|AM|
AU|AB|AN|AI|AM|AL|DV|DB|DI|DT|DR|DO|DX|AM|AG|AL|AN|AI|AB|AM|
AQ|AN|AH|AR|AM|AO|DH|DN|DJ|DO|DP|DG|DE|AT|AC|AO|AH|AR|AN|AM|
AU|AI|AR|AJ|AM|AR|DM|DL|DA|DX|DF|DE|DW|MA|AJ|AJ|AR|AJ|AI|AM|
AM|AM|AM|AM|AM|AE|DY|DU|DY|DQ|DS|DQ|DQ|AM|AM|AE|AM|AM|AM|AM|
AA|AL|AO|AR|AE|AL|DM|DS|DA|DR|DR|DP|DF|MA|AE|AL|AO|AJ|AL|AE|
DV|DV|DH|DM|DY|DM|DV|DC|DV|DV|DM|DH|DM|IZ|IT|IK|IR|IK|IU|IN|
DI|DB|DN|DL|DU|DS|DC|DK|DI|DB|DS|DB|DL|IT|II|IQ|IL|IB|IL|IS|
DJ|DI|DJ|DA|DY|DA|DV|DI|DJ|DI|DI|DI|DA|IY|IH|IH|IH|IH|IH|IN|
DI|DT|DO|DX|DQ|DR|DV|DB|DI|DT|DR|DO|DX|IU|IL|IJ|IA|IM|IG|IN|
DA|DR|DP|DF|DS|DR|DM|DS|DI|DR|DR|DP|DF|IK|IQ|IQ|IL|IC|IJ|IJ|
DJ|DO|DG|DE|DQ|DP|DH|DB|DI|DO|DP|DG|DE|IR|IL|IL|IR|IR|IA|IN|
DA|DX|DE|DW|DQ|DP|DM|DL|DA|DX|DF|DE|DW|IK|IB|IC|IR|ID|IM|IN|
AM|AM|AT|MA|AM|MA|IZ|IT|IY|IU|IK|IR|IK|IZ|IT|IK|IR|IK|IU|IN|
AA|AG|AC|AJ|AM|AE|IT|II|IH|IL|IQ|IL|IB|IT|II|IQ|IL|IB|IL|IS|
AA|AL|AO|AJ|AE|AL|IK|IQ|IH|IJ|IQ|IL|IC|IK|IQ|IQ|IL|IC|IJ|IJ|
AQ|AN|AH|AR|AM|AO|IR|IL|IH|IA|IL|IR|IR|IR|IL|IL|IR|IR|IA|IN|
AU|AI|AR|AJ|AM|AJ|IK|IB|IH|IM|IC|IR|ID|IK|IB|IC|IR|ID|IM|IN|
AU|AB|AN|AI|AM|AL|IU|IL|IH|IG|IJ|IA|IM|IU|IL|IJ|IA|IM|IG|IN|
AM|AM|AM|AM|AM|AE|IN|IS|IN|IN|IJ|IN|IN|IN|IS|IJ|IN|IN|IN|IN|`;

var mmDnaChart =
`AI|AI|AI|AI|AP|AI|MB|DM|MC|DG|MB|MC|AI|AI|AI|AI|AP|AI|
AI|AD|AA|AD|AA|AA|DC|DJ|DC|DC|DJ|DA|AI|AA|AA|AD|AA|AI|
AI|AA|AN|AL|AG|AN|DI|DI|DC|DI|DF|DI|AI|AN|AN|AL|AG|AK|
AI|AD|AL|AF|AP|AB|DF|DI|DJ|DG|DH|DK|AI|AB|AL|AF|AP|AI|
AP|AA|AG|AP|AP|AH|DI|DL|DC|DG|DG|DL|AO|AH|AG|AP|AO|AP|
AI|AA|AN|AB|AH|AJ|DI|DO|DJ|DP|DD|DL|AI|AJ|AN|AB|AH|AP|
MB|DC|DI|DF|DI|DI|DI|DI|DC|DI|DF|DI|IL|ID|ID|IM|IR|ID| 
DM|DJ|DI|DI|DL|DO|DI|DN|DJ|DL|DI|DB|IQ|IE|IR|IR|IS|IF|
MC|DC|DC|DJ|DC|DJ|DC|DJ|DC|DC|DJ|DA|IL|IL|IL|IL|IL|IA|
DG|DC|DI|DG|DG|DP|DI|DL|DC|DG|DG|DL|IN|IO|IR|IN|IC|IH|
MB|DJ|DF|DH|DG|DD|DF|DI|DJ|DG|DH|DK|IL|IP|IM|IK|IN|IA|
MC|DA|DI|DK|DL|DL|DI|DB|DA|DL|DK|DE|IL|IH|ID|IA|IH|IA|
AI|AI|AI|AI|AO|AI|IL|IQ|IL|IN|IL|IL|IL|IL|IL|IL|IN|IL|
AI|AA|AN|AB|AH|AJ|ID|IE|IL|IO|IP|IH|IL|II|ID|IP|IO|IH|
AI|AA|AN|AL|AG|AN|ID|IR|IL|IR|IM|ID|IL|ID|ID|IM|IR|ID|
AI|AD|AL|AF|AP|AB|IM|IR|IL|IN|IK|IA|IL|IP|IM|IK|IN|IA| 
AP|AA|AG|AP|AO|AH|IR|IS|IL|IC|IN|IH|IN|IO|IR|IN|IC|IH|
AI|AI|AK|AI|AP|AP|ID|IF|IA|IH|IA|IA|IL|IH|ID|IA|IH|IA|`;

var rookieDnaChart =
`Agumon|AA|
Biyomon|AB|
ClearAgumon|AC|
Gomamon|AD|
Penguinmon|AE|
SnowAgumon|AF|
Tapirmon|AG|
Tentomon|AH|
ToyAgumon|AI|
Veemon|AJ|
Tsukaimon|IM|
Candlemon|DA|
Crabmon|DB|
Elecmon|DC|
Floramon|DD|
Gabumon|DE|
Gotsumon|DF|
Palmon|DG|
Patamon|DH|
Mushroomon|II|
Otamamon|IJ|
SnowGoburimon|IK|
Syakomon|IL|
Betamon|IA|
DemiDevimon|IB|
Dokunemon|IC|
Gazimon|ID|
Gizamon|IE|
Goburimon|IF|
Hagurumon|IG|
Kunemon|IH|`

var championDnaChart = 
`Airdramon|B|AA|Biyomon 0-2|
Akatorimon|H|DA|Floramon 6+|Floramon 6+|
Bakemon|P|IA|Tsukaimon 0-2|
Angemon|C|AB|Patamon 8+|
Apemon|E|AC|Tapirmon 8+|
Birdramon|B|AD|Biyomon 8+|
Dolphmon|D|AE|Penguinmon 3+|
Flamedramon|B|AF|Veemon 4+|
Frigimon|E|AG|SnowAgumon 0-2|
Garurumon|E|AH|Tapirmon 6-7|Gabumon 8+|
Gatomon|C|AI|ToyAgumon 3+|
Greymon|A|AJ|Agumon 0+|
Gururumon|E|AK|SnowAgumon 6+|
Ikkakumon|D|AL|Gomamon 3+| Penguinmon 0-2|
Kabuterimon|F|AM|Tentomon 0+|
Leomon|C|AN|ToyAgumon 0-2|
Mojyamon|E|AO|SnowAgumon 3-5|
Piddomon|C|AP|ClearAgumon 3+|
Saberdramon|B|AQ|Biyomon 6-7|
ShimaUnimon|E|AR|Tapirmon 3-5|
Tortomon|D|AS|Gomamon 0-2|
Unimon|E|AT|Tapirmon 0-2|
Veedramon|B|AU|Biyomon 3-5|Veemon 0-3|
Centarumon|K|DB|Gabumon 0-2|
Clockmon|M|DC|Candlemon 6+|
Coelamon|J|DD|Crabmon 0-2|
Drimogenmon|K|DE|Gabumon 3-5|
Flarerizamon|G|DF|Elecmon 3-5|
Icemon|K|DG|Gotsumon 0-2|
J-Mojyamon|K|DH|Gotsumon 6+|
Kiwimon|H|DI|Floramon 0-2|
Kokatorimon|H|DJ|Floramon 3-5|
Meramon|M|DK|Candlemon 3-5|
Monochromon|G|DL|Elecmon 6+|
MoriShellmon|J|DM|Crabmon 3-5|
MudFrigimon|K|DN|Gotsumon 3-5|
Ninjamon|I|DO|Patamon 0-2|
N-Drimogemon|K|DP|Gabumon 6-7|
SandYanmamon|L|DQ|
Seadramon|J|DR|Crabmon 6+|
Shellmon|J|DS|Crabmon 6-7|
Starmon|I|DT|Patamon 3-5|
Tankmon|M|DU|Candlemon 0-2|
Togemon|N|DV|Palmon 0+|
Tyrannomon|G|DW|Elecmon 0-2|
Wizardmon|I|DX|Patamon 6-7|
Yanmamon|L|DY|
Cyclonemon|O|IB|Gizamon 0-2|
Darkrizamon|O|IC|Betamon 3-5|
D-Tyrannomon|O|ID|Betamon 0-2|
Deltamon|O|IE|Gizamon 3-5|
Devidramon|O|IF|Gizamon 6+|
Devimon|P|IG|DemiDevimon 4+|
Flymon|S|IH|Dokunemon 0+|
Gekomon|Q|II|Otamamon 0-2|
Gesomon|Q|IJ|Syakomon 3+|
Guardromon|T|IK|Hagurumon 6+|
Hyogamon|R|IL|SnowGoburimon 0+|
IceDevimon|P|IM|DemiDevimon 0-3|
Kuwagamon|S|IN|Kunemon 0+|
Nanimon|P|IO|Gazimon 0+|
Numemon|T|IP|Hagurumon 0+|
Octomon|Q|IQ|Otamamon 3+|Syakomon 0-2|
Ogremon|R|IR|Gaburimon 0+|
P-Sukamon|T|IS|Hagurumon 2-3|
Raremon|T|IT|Hagurumon 4-5|
RedVegiemon|U|IU|Mushroomon 0|
Soulmon|P|IV|Tsukaimon 3+|
Sukamon|T|IW|Hagurumon 1|
Tuskmon|O|IX|Betamon 6+|
Vegiemon|U|IY|Mushroomon 1-3|
Woodmon|U|IZ|Mushroomon 4+|`

var ultimateDnaChart =
`AeroVeedramon|A|AA|Airdramon 0+|Flamedramon 0-5|Veedramon 0+|
Andromon|B|AB|Angemon 0-5|
Angewomon|B|AC|Gatomon 0+|
Garudamon|A|AD|Birdramon 0+|Saberdramon 0+|
Giromon|B|AE|Piddomon 6+|
MagnaAngemon|B|AF|Angemon 6+|Piddomon 0-6|
Mammothmon|C|AG|Apemon 0+|ShimaUnimon 0+|Unimon 0+|
M-Tyrannomon|D|AH|Tyrannomon 8+|Greymon 6-8|
M-Kabuterimon|E|AI|Kabuterimon 0+|
MetalGreymon|D|AJ|Greymon 0-5|
Monzaemon|C|AK|Frigimon 0+|Mojyamon 0+|
Panjyamon|B|AL|Leomon 0+|
Raidramon|A|AM|Flamedramon 6+|
WereGarurumon|C|AN|Garurumon 0+|Gururumon 0+|
Whamon|F|AO|Dolphmon 0+|Ikkakumon 0-5|
Zudomon|F|AP|Ikkakumon 6+|Tortomon 0+|
Blossomon|G|DA|Togemon 6-7|
BlueMeramon|H|DB|Meramon 0-5|
Deramon|I|DC|Kiwimon 0+|Kokatorimon 0-5|
Digitamamon|J|DD|Starmon 8+|Wizardmon 0+|
Lillymon|G|DE|Togemon 8+|
Mamemon|J|DF|Ninjamon 0+|Starmon 0-5|
MegaSeadramon|K|DG|Coelamon 0+|Seadramon 0+|
MetalMamemon|J|DH|Starmon 6-7|
Meteormon|L|DI|Centarumon 0+|Drimogemon 0+|Icemon 0+|J-Mojyamon 0+|MudFrigimon 0+|NiseDrimogemon 0+|
Piximon|I|DJ|Akatorimon 0+|Kokatorimon 6+|
Pumpkinmon|G|DK|Togemon 0-5|Yanmamon 0+|
Scorpiomon|K|DL|Morishellmon 0+|Shellmon 0+|
SkullMeramon|H|DM|Clockmon 8+|Meramon 6+|Tankmon 6+|
Tinmon|H|DN|Clockmon 0-7|Tankmon 0-5|
Triceramon|M|DO|Flarerizamon 0-5|Tyrannomon 0-7|
Vermillimon|M|DP|Flareizamon 6+|Monochromon 0+|
Cherrymon|N|IA|RedVegiemon 0+|Vegiemon 0+|Woodmon 0+|
Datamon|O|IB|Guardromon 9+|
Dragmon|P|IC|
Etemon|Q|ID|Ogremon 0+|
Extyrannomon|R|IE|Darkrizamon 0+|DarkTyrannomon 0-5|
Garbagemon|O|IF|Guardromon 6-8|Raremon 5+|
Gigadramon|R|IG|Deltamon 6+|Devidramon 0+|
MarineDevimon|P|IH|Gesomon 0-5|
Megadramon|R|II|Cyclonemon 0+|Deltamon 0-5|
MetalTyrannomon|R|IJ|DarkTyrannomon 6+|Tuskmon 0+|
Myotismon|S|IK|Devimon 0+|IceDevimon 0+|
Okuwamon|T|IL|Flymon 0+|Kuwagamon 0+|
Phantomon|S|IM|Bakemon 0+|Soulmon 0+|
ShogunGekomon|P|IN|Gekomon 0+|
SkullGreymon|R|IO|Greymon 9+|
Tekkamon|S|IP|Nanimon 0+|
Vademon|O|IQ|Guardromon 0-5|P-Sukamon 0+|Raremon 0-4|
WaruMonzaemon|Q|IR|Hyogamon 0+|
WaruSeadramon|P|IS|Gesomon 6+|`;

var megaDnaChart =
`H-Kabuterimon|A|M-Kabuterimon 0+|
I-dramon|B|Raidramon 8+|
Jijimon|C|Monzaemon 0+|
Magnadramon|D|Angewomon 0+|Panjyamon 9|
MarineAngemon|E|Whamon 0+|Zudomon 9+|
Omnimon|F|MetalGreymon 20+|
Phoenixmon|B|AeroVeedramon 0+|Garudamon 0+|Raidramon 0-7|
Seraphimon|D|Andromon 0+|Giromon 0+|MagnaAngemon 0+|
S-Mammothmon|C|Mammothmon 0+|WereGarurumon 0-7|
WarGreymon|F|MasterTyrannomon 0+|WarGreymon 0-19|
Baihumon|G|Meteormon 20+|
Boltmon|H|BlueMeramon 0+|SkullMeramon 0+|Tinmon 0+|
Gryphonmon|I|Deramon 0+|Piximon 0+|
Kimeramon|H|
M-Garurumon|G|Meteormon 0-19|WereGarurumon 8+|
M-Seadramon|J|MegaSeadramon 0+|
Preciomon|J|Scorpiomon 0+|Zudomon 0-8|
P-Mamemon|K|Mamemon 0+|MetalMamemon 0-8|
Rosemon|L|Blossomon 0+|Lillymon 0+|Pumpkinmon 0+|
SaberLeomon|K|Digitamamon 0+|MetalMamemon 9+|Panjyamon 0-8|
Diaboromon|M|Okuwagamon 20+|
GranKuwagamon|M|Okuwagamon 0-19|
Machinedramon|N|SkullGreymon|
MetalEtemon|O|Etemon 0+|WaruMonzaemon 0+| 
Pierrotmon|P|
Pukumon|Q|Dragomon 0+|MarineDevimon 0+|ShogumonGekomon 0+|WaruSeadramon 0+|
Puppetmon|R|Cherrymon 0+|
VenomMyotismon|P|Myostismon 0+|`