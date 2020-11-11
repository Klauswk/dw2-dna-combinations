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
            return { name: row[0], stage: 1, cc: row[1] };
        });

        return rookieArray;
    }

    var loadChampionDnaChart = function () {
        var championRawArray = parseDataTable(championDnaChart);

        var championArray = championRawArray.map(row => {
            return { name: row[0], stage: 2, cc: row[1], uc: row[2] };
        });

        return championArray;
    }

    var loadUltimateDnaChart = function () {
        var ultimateRawArray = parseDataTable(ultimateDnaChart);

        var ultimateArray = ultimateRawArray.map(row => {
            return { name: row[0], stage: 3, uc: row[1], mc: row[2] };
        });

        return ultimateArray;
    }

    var loadMegaDnaChart = function () {
        var megaRawArray = parseDataTable(megaDnaChart);

        var megaArray = megaRawArray.map(row => {
            return { name: row[0], stage: 4, mc: row[1] };
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

    var searchDigimon = (digimon) => {
        $scope.results = [];

        var digimonByName = search(digimon);

        if (digimonByName) {
            if (digimonByName.stage === 1) {
                var result = searchInTable(ccDnaTable, digimonByName.cc);

                var combinations = findCCCombination(result);

                combinations.sort(sortByName);

                $scope.results = combinations;
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

                $scope.results = combinations;
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

                $scope.results = combinations;
            }

            if (digimonByName.stage === 4) {
                $scope.results = [{ first: { name: "Can't combine mega to get other mega" }, second: { name: "" } }];
            }
        }
    };

    var checkForEnter = (event) => {
        if( event.keyCode == 13 || event.which == 13 ) {
            searchDigimon($scope.digimon);
        }
    }

    $scope.results = [];

    $scope.digimon = { name: "", stage: "" };

    $scope.searchDigimon = searchDigimon;

    $scope.checkForEnter = checkForEnter;

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
`Airdramon|B|AA|
Akatorimon|H|DA|
Bakemon|P|IA|
Angemon|C|AB|
Apemon|E|AC|
Birdramon|B|AD|
Dolphmon|D|AE|
Flamedramon|B|AF|
Frigimon|E|AG|
Garurumon|E|AH|
Gatomon|C|AI|
Greymon|A|AJ|
Gururumon|E|AK|
Ikkakumon|D|AL|
Kabuterimon|F|AM|
Leomon|C|AN|
Mojyamon|E|AO|
Piddomon|C|AP|
Saberdramon|B|AQ|
ShimaUnimon|E|AR|
Tortomon|D|AS|
Unimon|E|AT|
Veedramon|B|AU|
Centarumon|K|DB|
Clockmon|M|DC|
Coelamon|J|DD|
Drimogenmon|K|DE|
Flarerizamon|G|DF|
Icemon|K|DG|
J-Mojyamon|K|DH|
Kiwimon|H|DI|
Kokatorimon|H|DJ|
Meramon|M|DK|
Monochromon|G|DL|
MoriShellmon|J|DM|
MudFrigimon|K|DN|
Ninjamon|I|DO|
N-Drimogemon|K|DP|
SandYanmamon|L|DQ|
Seadramon|J|DR|
Shellmon|J|DS|
Starmon|I|DT|
Tankmon|M|DU|
Togemon|N|DV|
Tyrannomon|G|DW|
Wizardmon|I|DX|
Yanmamon|L|DY|
Cyclonemon|O|IB|
Darkrizamon|O|IC|
D-Tyrannomon|O|ID|
Deltamon|O|IE|
Devidramon|O|IF|
Devimon|P|IG|
Flymon|S|IH|
Gekomon|Q|II|
Gesomon|Q|IJ|
Guardromon|T|IK|
Hyogamon|R|IL|
IceDevimon|P|IM|
Kuwagamon|S|IN|
Nanimon|P|IO|
Numemon|T|IP|
Octomon|Q|IQ|
Ogremon|R|IR|
P-Sukamon|T|IS|
Raremon|T|IT|
RedVegiemon|U|IU|
Soulmon|P|IV|
Sukamon|T|IW|
Tuskmon|O|IX|
Vegiemon|U|IY|
Woodmon|U|IZ|`

var ultimateDnaChart =
`AeroVeedramon|A|AA|
Andromon|B|AB|
Angewomon|B|AC|
Garudamon|A|AD|
Giromon|B|AE|
MagnaAngemon|B|AF|
Mammothmon|C|AG|
M-Tyrannomon|D|AH|
M-Kabuterimon|E|AI|
MetalGreymon|D|AJ|
Monzaemon|C|AK|
Panjyamon|B|AL|
Raidramon|A|AM|
WereGarurumon|C|AN|
Whamon|F|AO|
Zudomon|F|AP|
Blossomon|G|DA|
BlueMeramon|H|DB|
Deramon|I|DC|
Digitamamon|J|DD|
Lillymon|G|DE|
Mamemon|J|DF|
MegaSeadramon|K|DG|
MetalMamemon|J|DH|
Meteormon|L|DI|
Piximon|I|DJ|
Pumpkinmon|G|DK|
Scorpiomon|K|DL|
SkullMeramon|H|DM|
Tinmon|H|DN|
Triceramon|M|DO|
Vermillimon|M|DP|
Cherrymon|N|IA|
Datamon|O|IB|
Dragmon|P|IC|
Etemon|Q|ID|
Extyrannomon|R|IE|
Garbagemon|O|IF|
Gigadramon|R|IG|
MarineDevimon|P|IH|
Megadramon|R|II|
MetalTyrannomon|R|IJ|
Myotismon|S|IK|
Okuwamon|T|IL|
Phantomon|S|IM|
ShogunGekomon|P|IN|
SkullGreymon|R|IO|
Tekkamon|S|IP|
Vademon|O|IQ|
WaruMonzaemon|Q|IR|
WaruSeadramon|P|IS|`;

var megaDnaChart =
`H-Kabuterimon|A|
I-dramon|B|
Jijimon|C|
Magnadramon|D|
MarineAngemon|E|
Omnimon|F|
Phoenixmon|B|
Seraphimon|D|
S-Mammothmon|C|
WarGreymon|F|
Baihumon|G|
Boltmon|H|
Gryphonmon|I|
Kimeramon|H|
M-Garurumon|G|
M-Seadramon|J|
Preciomon|J|
P-Mamemon|K|
Rosemon|L|
SaberLeomon|K|
Diaboromon|M|
GranKuwagamon|M|
Machinedramon|N|
MetalEtemon|O|
Pierrotmon|P|
Pukumon|Q|
Puppetmon|R|
VenomMyotismon|P|`