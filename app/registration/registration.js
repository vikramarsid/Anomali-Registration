'use strict';

angular.module('myApp.registration', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/registration', {
            templateUrl: 'registration/registration.html',
            controller: 'RegistrationCtrl'
        });
    }])

    .controller('RegistrationCtrl', function ($scope, $http, $log, $timeout) {

        $scope.passRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/;
        $scope.phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        $scope.zipRegex = /^\d{5}(?:[-\s]\d{4})?$/;
        $scope.industries = [
            {code: "CE", name: "Computer Engineering"},
            {code: "IT", name: "Information Technology"},
            {code: "IS", name: "Information Security"},
            {code: "NS", name: "Network Security"},
            {code: "ME", name: "Mechanical Engineering"}
        ];

        // Form submit handler.
        $scope.submitForm = function (form) {

            $scope.submitted = true;

            // If form is invalid, return and let AngularJS show validation errors.
            if (form.$invalid) {
                $scope.validationFailed = $scope.country.code == "" ? true : false;
                $scope.statevalidationFailed = ($scope.validationFailed == false) && ($scope.state.code == "") ? true : false;
                return;
            } else {
                alert("Thank you for registering");
            }

            // Default values for the request.
            var config = {
                params: {
                    'callback': 'JSON_CALLBACK',
                    'firstname': $scope.firstName,
                    'lastname': $scope.lastName,
                    'email': $scope.email,
                    'companyname': $scope.companyName,
                    'phonenumber': $scope.phoneNumber,
                    'state': ($scope.country.code == "US") ? $scope.state : "NA",
                    'industry': $scope.industry,
                    'zip': $scope.zip,
                    'key': $scope.password
                }
            };

            var $promise = $http.jsonp('response.json', config)
                .success(function (data, status, headers, config) {
                    if (data.status == 'OK') {
                        $scope.firstName = null;
                        $scope.lastName = null;
                        $scope.email = null;
                        $scope.companyName = null;
                        $scope.phoneNumber = null;
                        $scope.zip = null;
                        $scope.confirmpassword = null;
                        $scope.password = null;
                        $scope.messages = 'Your form has been sent!';
                        $scope.submitted = false;
                    } else {
                        $scope.messages = 'Oops, we received your request, but there was an error processing it.';
                        $scope.confirmpassword = null;
                        $scope.password = null;
                        $log.error(data);
                    }
                })
                .error(function (data, status, headers, config) {
                    $scope.progress = data;
                    $scope.messages = 'There was a network error. Try again later.';
                    $scope.confirmpassword = null;
                    $scope.password = null;
                    $log.error(data);
                })
                .finally(function () {
                    // Hide status messages after three seconds.
                    $timeout(function () {
                        $scope.messages = null;
                    }, 3000);
                });
        };
    })
    //Directive to confirm password
    .directive('pConfirm', [function () {
        return {
            require: 'ngModel',
            link: function (scope, elem, attrs, ctrl) {
                var firstPassword = '#' + attrs.pConfirm;
                elem.on('keyup', function () {
                    scope.$apply(function () {
                        ctrl.$setValidity('pmatch', elem.val() === document.querySelector(firstPassword).value);
                    });
                });
            }
        }
    }])

    // directive to select country
    .directive('countrySelect', ['$parse', function ($parse) {
        var countries = [
            {code: "", name: "- Please Select -"},
            {code: "AF", name: "Afghanistan"},
            {code: "AX", name: "Åland Islands"},
            {code: "AL", name: "Albania"},
            {code: "DZ", name: "Algeria"},
            {code: "AS", name: "American Samoa"},
            {code: "AD", name: "Andorra"},
            {code: "AO", name: "Angola"},
            {code: "AI", name: "Anguilla"},
            {code: "AQ", name: "Antarctica"},
            {code: "AG", name: "Antigua and Barbuda"},
            {code: "AR", name: "Argentina"},
            {code: "AM", name: "Armenia"},
            {code: "AW", name: "Aruba"},
            {code: "AU", name: "Australia"},
            {code: "AT", name: "Austria"},
            {code: "AZ", name: "Azerbaijan"},
            {code: "BS", name: "Bahamas"},
            {code: "BH", name: "Bahrain"},
            {code: "BD", name: "Bangladesh"},
            {code: "BB", name: "Barbados"},
            {code: "BY", name: "Belarus"},
            {code: "BE", name: "Belgium"},
            {code: "BZ", name: "Belize"},
            {code: "BJ", name: "Benin"},
            {code: "BM", name: "Bermuda"},
            {code: "BT", name: "Bhutan"},
            {code: "BO", name: "Bolivia, Plurinational State of"},
            {code: "BQ", name: "Bonaire, Sint Eustatius and Saba"},
            {code: "BA", name: "Bosnia and Herzegovina"},
            {code: "BW", name: "Botswana"},
            {code: "BV", name: "Bouvet Island"},
            {code: "BR", name: "Brazil"},
            {code: "IO", name: "British Indian Ocean Territory"},
            {code: "BN", name: "Brunei Darussalam"},
            {code: "BG", name: "Bulgaria"},
            {code: "BF", name: "Burkina Faso"},
            {code: "BI", name: "Burundi"},
            {code: "KH", name: "Cambodia"},
            {code: "CM", name: "Cameroon"},
            {code: "CA", name: "Canada"},
            {code: "CV", name: "Cape Verde"},
            {code: "KY", name: "Cayman Islands"},
            {code: "CF", name: "Central African Republic"},
            {code: "TD", name: "Chad"},
            {code: "CL", name: "Chile"},
            {code: "CN", name: "China"},
            {code: "CX", name: "Christmas Island"},
            {code: "CC", name: "Cocos (Keeling) Islands"},
            {code: "CO", name: "Colombia"},
            {code: "KM", name: "Comoros"},
            {code: "CG", name: "Congo"},
            {code: "CD", name: "Congo, the Democratic Republic of the"},
            {code: "CK", name: "Cook Islands"},
            {code: "CR", name: "Costa Rica"},
            {code: "CI", name: "Côte d'Ivoire"},
            {code: "HR", name: "Croatia"},
            {code: "CU", name: "Cuba"},
            {code: "CW", name: "Curaçao"},
            {code: "CY", name: "Cyprus"},
            {code: "CZ", name: "Czech Republic"},
            {code: "DK", name: "Denmark"},
            {code: "DJ", name: "Djibouti"},
            {code: "DM", name: "Dominica"},
            {code: "DO", name: "Dominican Republic"},
            {code: "EC", name: "Ecuador"},
            {code: "EG", name: "Egypt"},
            {code: "SV", name: "El Salvador"},
            {code: "GQ", name: "Equatorial Guinea"},
            {code: "ER", name: "Eritrea"},
            {code: "EE", name: "Estonia"},
            {code: "ET", name: "Ethiopia"},
            {code: "FK", name: "Falkland Islands (Malvinas)"},
            {code: "FO", name: "Faroe Islands"},
            {code: "FJ", name: "Fiji"},
            {code: "FI", name: "Finland"},
            {code: "FR", name: "France"},
            {code: "GF", name: "French Guiana"},
            {code: "PF", name: "French Polynesia"},
            {code: "TF", name: "French Southern Territories"},
            {code: "GA", name: "Gabon"},
            {code: "GM", name: "Gambia"},
            {code: "GE", name: "Georgia"},
            {code: "DE", name: "Germany"},
            {code: "GH", name: "Ghana"},
            {code: "GI", name: "Gibraltar"},
            {code: "GR", name: "Greece"},
            {code: "GL", name: "Greenland"},
            {code: "GD", name: "Grenada"},
            {code: "GP", name: "Guadeloupe"},
            {code: "GU", name: "Guam"},
            {code: "GT", name: "Guatemala"},
            {code: "GG", name: "Guernsey"},
            {code: "GN", name: "Guinea"},
            {code: "GW", name: "Guinea-Bissau"},
            {code: "GY", name: "Guyana"},
            {code: "HT", name: "Haiti"},
            {code: "HM", name: "Heard Island and McDonald Islands"},
            {code: "VA", name: "Holy See (Vatican City State)"},
            {code: "HN", name: "Honduras"},
            {code: "HK", name: "Hong Kong"},
            {code: "HU", name: "Hungary"},
            {code: "IS", name: "Iceland"},
            {code: "IN", name: "India"},
            {code: "ID", name: "Indonesia"},
            {code: "IR", name: "Iran, Islamic Republic of"},
            {code: "IQ", name: "Iraq"},
            {code: "IE", name: "Ireland"},
            {code: "IM", name: "Isle of Man"},
            {code: "IL", name: "Israel"},
            {code: "IT", name: "Italy"},
            {code: "JM", name: "Jamaica"},
            {code: "JP", name: "Japan"},
            {code: "JE", name: "Jersey"},
            {code: "JO", name: "Jordan"},
            {code: "KZ", name: "Kazakhstan"},
            {code: "KE", name: "Kenya"},
            {code: "KI", name: "Kiribati"},
            {code: "KP", name: "Korea, Democratic People's Republic of"},
            {code: "KR", name: "Korea, Republic of"},
            {code: "KW", name: "Kuwait"},
            {code: "KG", name: "Kyrgyzstan"},
            {code: "LA", name: "Lao People's Democratic Republic"},
            {code: "LV", name: "Latvia"},
            {code: "LB", name: "Lebanon"},
            {code: "LS", name: "Lesotho"},
            {code: "LR", name: "Liberia"},
            {code: "LY", name: "Libya"},
            {code: "LI", name: "Liechtenstein"},
            {code: "LT", name: "Lithuania"},
            {code: "LU", name: "Luxembourg"},
            {code: "MO", name: "Macao"},
            {code: "MK", name: "Macedonia, the former Yugoslav Republic of"},
            {code: "MG", name: "Madagascar"},
            {code: "MW", name: "Malawi"},
            {code: "MY", name: "Malaysia"},
            {code: "MV", name: "Maldives"},
            {code: "ML", name: "Mali"},
            {code: "MT", name: "Malta"},
            {code: "MH", name: "Marshall Islands"},
            {code: "MQ", name: "Martinique"},
            {code: "MR", name: "Mauritania"},
            {code: "MU", name: "Mauritius"},
            {code: "YT", name: "Mayotte"},
            {code: "MX", name: "Mexico"},
            {code: "FM", name: "Micronesia, Federated States of"},
            {code: "MD", name: "Moldova, Republic of"},
            {code: "MC", name: "Monaco"},
            {code: "MN", name: "Mongolia"},
            {code: "ME", name: "Montenegro"},
            {code: "MS", name: "Montserrat"},
            {code: "MA", name: "Morocco"},
            {code: "MZ", name: "Mozambique"},
            {code: "MM", name: "Myanmar"},
            {code: "NA", name: "Namibia"},
            {code: "NR", name: "Nauru"},
            {code: "NP", name: "Nepal"},
            {code: "NL", name: "Netherlands"},
            {code: "NC", name: "New Caledonia"},
            {code: "NZ", name: "New Zealand"},
            {code: "NI", name: "Nicaragua"},
            {code: "NE", name: "Niger"},
            {code: "NG", name: "Nigeria"},
            {code: "NU", name: "Niue"},
            {code: "NF", name: "Norfolk Island"},
            {code: "MP", name: "Northern Mariana Islands"},
            {code: "NO", name: "Norway"},
            {code: "OM", name: "Oman"},
            {code: "PK", name: "Pakistan"},
            {code: "PW", name: "Palau"},
            {code: "PS", name: "Palestine, State of"},
            {code: "PA", name: "Panama"},
            {code: "PG", name: "Papua New Guinea"},
            {code: "PY", name: "Paraguay"},
            {code: "PE", name: "Peru"},
            {code: "PH", name: "Philippines"},
            {code: "PN", name: "Pitcairn"},
            {code: "PL", name: "Poland"},
            {code: "PT", name: "Portugal"},
            {code: "PR", name: "Puerto Rico"},
            {code: "QA", name: "Qatar"},
            {code: "RE", name: "Réunion"},
            {code: "RO", name: "Romania"},
            {code: "RU", name: "Russian Federation"},
            {code: "RW", name: "Rwanda"},
            {code: "BL", name: "Saint Barthélemy"},
            {code: "SH", name: "Saint Helena, Ascension and Tristan da Cunha"},
            {code: "KN", name: "Saint Kitts and Nevis"},
            {code: "LC", name: "Saint Lucia"},
            {code: "MF", name: "Saint Martin (French part)"},
            {code: "PM", name: "Saint Pierre and Miquelon"},
            {code: "VC", name: "Saint Vincent and the Grenadines"},
            {code: "WS", name: "Samoa"},
            {code: "SM", name: "San Marino"},
            {code: "ST", name: "Sao Tome and Principe"},
            {code: "SA", name: "Saudi Arabia"},
            {code: "SN", name: "Senegal"},
            {code: "RS", name: "Serbia"},
            {code: "SC", name: "Seychelles"},
            {code: "SL", name: "Sierra Leone"},
            {code: "SG", name: "Singapore"},
            {code: "SX", name: "Sint Maarten (Dutch part)"},
            {code: "SK", name: "Slovakia"},
            {code: "SI", name: "Slovenia"},
            {code: "SB", name: "Solomon Islands"},
            {code: "SO", name: "Somalia"},
            {code: "ZA", name: "South Africa"},
            {code: "GS", name: "South Georgia and the South Sandwich Islands"},
            {code: "SS", name: "South Sudan"},
            {code: "ES", name: "Spain"},
            {code: "LK", name: "Sri Lanka"},
            {code: "SD", name: "Sudan"},
            {code: "SR", name: "Suriname"},
            {code: "SJ", name: "Svalbard and Jan Mayen"},
            {code: "SZ", name: "Swaziland"},
            {code: "SE", name: "Sweden"},
            {code: "CH", name: "Switzerland"},
            {code: "SY", name: "Syrian Arab Republic"},
            {code: "TW", name: "Taiwan, Province of China"},
            {code: "TJ", name: "Tajikistan"},
            {code: "TZ", name: "Tanzania, United Republic of"},
            {code: "TH", name: "Thailand"},
            {code: "TL", name: "Timor-Leste"},
            {code: "TG", name: "Togo"},
            {code: "TK", name: "Tokelau"},
            {code: "TO", name: "Tonga"},
            {code: "TT", name: "Trinidad and Tobago"},
            {code: "TN", name: "Tunisia"},
            {code: "TR", name: "Turkey"},
            {code: "TM", name: "Turkmenistan"},
            {code: "TC", name: "Turks and Caicos Islands"},
            {code: "TV", name: "Tuvalu"},
            {code: "UG", name: "Uganda"},
            {code: "UA", name: "Ukraine"},
            {code: "AE", name: "United Arab Emirates"},
            {code: "GB", name: "United Kingdom"},
            {code: "US", name: "United States"},
            {code: "UM", name: "United States Minor Outlying Islands"},
            {code: "UY", name: "Uruguay"},
            {code: "UZ", name: "Uzbekistan"},
            {code: "VU", name: "Vanuatu"},
            {code: "VE", name: "Venezuela, Bolivarian Republic of"},
            {code: "VN", name: "Viet Nam"},
            {code: "VG", name: "Virgin Islands, British"},
            {code: "VI", name: "Virgin Islands, U.S."},
            {code: "WF", name: "Wallis and Futuna"},
            {code: "EH", name: "Western Sahara"},
            {code: "YE", name: "Yemen"},
            {code: "ZM", name: "Zambia"},
            {code: "ZW", name: "Zimbabwe"}
        ];

        return {
            require: 'ngModel',
            restrict: "E",
            template: '<select ng-options="c.name for c in countries">',
            replace: true,
            link: function (scope, elem, attrs) {
                scope.countries = countries;

                if (!!attrs.ngModel) {
                    var assignCountry = $parse(attrs.ngModel);
                    assignCountry.assign(scope, countries[0]);
                    elem.bind('change', function (e) {
                        assignCountry(elem);
                    });
                }
            }
        }
    }])

    //directive to select state
    .directive('stateSelect', ['$parse', function ($parse) {
        var states = [
            {code: "", name: "- Please Select (US Only) -"},
            {code: "AL", name: "Alabama"},
            {code: "AK", name: "Alaska"},
            {code: "AS", name: "American Samoa"},
            {code: "AZ", name: "Arizona"},
            {code: "AR", name: "Arkansas"},
            {code: "CA", name: "California"},
            {code: "CO", name: "Colorado"},
            {code: "CT", name: "Connecticut"},
            {code: "DE", name: "Delaware"},
            {code: "DC", name: "District Of Columbia"},
            {code: "FM", name: "Federated States Of Micronesia"},
            {code: "FL", name: "Florida"},
            {code: "GA", name: "Georgia"},
            {code: "GU", name: "Guam"},
            {code: "HI", name: "Hawaii"},
            {code: "ID", name: "Idaho"},
            {code: "IL", name: "Illinois"},
            {code: "IN", name: "Indiana"},
            {code: "IA", name: "Iowa"},
            {code: "KS", name: "Kansas"},
            {code: "KY", name: "Kentucky"},
            {code: "LA", name: "Louisiana"},
            {code: "ME", name: "Maine"},
            {code: "MH", name: "Marshall Islands"},
            {code: "MD", name: "Maryland"},
            {code: "MA", name: "Massachusetts"},
            {code: "MI", name: "Michigan"},
            {code: "MN", name: "Minnesota"},
            {code: "MS", name: "Mississippi"},
            {code: "MO", name: "Missouri"},
            {code: "MT", name: "Montana"},
            {code: "NE", name: "Nebraska"},
            {code: "NV", name: "Nevada"},
            {code: "NH", name: "New Hampshire"},
            {code: "NJ", name: "New Jersey"},
            {code: "NM", name: "New Mexico"},
            {code: "NY", name: "New York"},
            {code: "NC", name: "North Carolina"},
            {code: "ND", name: "North Dakota"},
            {code: "MP", name: "Northern Mariana Islands"},
            {code: "OH", name: "Ohio"},
            {code: "OK", name: "Oklahoma"},
            {code: "OR", name: "Oregon"},
            {code: "PW", name: "Palau"},
            {code: "PA", name: "Pennsylvania"},
            {code: "PR", name: "Puerto Rico"},
            {code: "RI", name: "Rhode Island"},
            {code: "SC", name: "South Carolina"},
            {code: "SD", name: "South Dakota"},
            {code: "TN", name: "Tennessee"},
            {code: "TX", name: "Texas"},
            {code: "UT", name: "Utah"},
            {code: "VT", name: "Vermont"},
            {code: "VI", name: "Virgin Islands"},
            {code: "VA", name: "Virginia"},
            {code: "WA", name: "Washington"},
            {code: "WV", name: "West Virginia"},
            {code: "WI", name: "Wisconsin"},
            {code: "WY", name: "Wyoming"}
        ];

        return {
            require: 'ngModel',
            restrict: "E",
            template: '<select  ng-options="c.name for c in states">',
            replace: true,
            link: function (scope, elem, attrs) {
                scope.states = states;

                if (!!attrs.ngModel) {

                    var assignState = $parse(attrs.ngModel);
                    assignState.assign(scope, states[0]);
                    elem.bind('change', function (e) {
                        assignState(elem);
                    });

                }

            }
        }
    }]);

