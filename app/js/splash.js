'use strict';

var app = angular.module("ictApp", []);

app.controller('SplashCtrl', function($scope){
    $scope.incident_start_btns = [
        {
            'hidden': true
        },
        {
            'type': 'fire',
            'icon': "img/icons/fire.png",
            'text': "Fire Incident"
        },
        {
            'type': 'medical',
            'icon': "img/icons/medical.png",
            'text': "Medical Incident"
        },
        {
            'hidden': true
        },
        {
            'type': 'arff',
            'icon': "img/icons/plane.png",
            'text': "ARFF Incident"
        },
        {
//        type: 'hazmat',
            'type': 'arff',
            'icon': "img/icons/hazmat.png",
            'text': "HazMat Incident"
        },
        {
            'type': 'water',
            'icon': "img/icons/water.png",
            'text': "Water Rescue"
        },
        {
//        type: 'trench',
            'type': 'arff',
            'icon': "img/icons/trench.png",
            'text': "Trench Rescue"
        },
        {
//        type: 'mountain',
            'type': 'arff',
            'icon': "img/icons/mountain.png",
            'text': "Mountain Rescue"
        },
        {
//        type: 'palm',
            'type': 'arff',
            'icon': "img/icons/palm.png",
            'text': "Palm Rescue"
        },
        {
//        type: 'struct',
            'type': 'arff',
            'icon': "img/icons/structure.png",
            'text': "Structural Rescue"
        },
        {
//        type: 'confined',
            'type': 'arff',
            'icon': "img/icons/confined.png",
            'text': "Confined Space Rescue"
        }
    ];
});
