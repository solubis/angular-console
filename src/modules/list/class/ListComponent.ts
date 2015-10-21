import {Component, View, Inject} from 'angular-components';

@Component({
    selector: 'list-component'
})
@View({
    templateUrl: 'modules/list/html/list.html'
})
@Inject('$timeout', '$q', '$mdDialog', '$mdToast', '$mdSidenav')
class ListComponent {

    constructor(
        private $timeout: ng.ITimeoutService,
        private $q: ng.IQService,
        private $mdDialog: angular.material.IDialogService,
        private $mdToast: angular.material.IToastService,
        private $mdSidenav: angular.material.ISidenavService) {

        this.desserts = {
            'count': 9,
            'data': [
                {
                    'name': 'Frozen yogurt',
                    'type': 'Ice cream',
                    'calories': { 'value': 159.0 },
                    'fat': { 'value': 6.0 },
                    'carbs': { 'value': 24.0 },
                    'protein': { 'value': 4.0 },
                    'sodium': { 'value': 87.0 },
                    'calcium': { 'value': 14.0 },
                    'iron': { 'value': 1.0 }
                }, {
                    'name': 'Ice cream sandwich',
                    'type': 'Ice cream',
                    'calories': { 'value': 237.0 },
                    'fat': { 'value': 9.0 },
                    'carbs': { 'value': 37.0 },
                    'protein': { 'value': 4.3 },
                    'sodium': { 'value': 129.0 },
                    'calcium': { 'value': 8.0 },
                    'iron': { 'value': 1.0 }
                }, {
                    'name': 'Eclair',
                    'type': 'Pastry',
                    'calories': { 'value': 262.0 },
                    'fat': { 'value': 16.0 },
                    'carbs': { 'value': 24.0 },
                    'protein': { 'value': 6.0 },
                    'sodium': { 'value': 337.0 },
                    'calcium': { 'value': 6.0 },
                    'iron': { 'value': 7.0 }
                }, {
                    'name': 'Cupcake',
                    'type': 'Pastry',
                    'calories': { 'value': 305.0 },
                    'fat': { 'value': 3.7 },
                    'carbs': { 'value': 67.0 },
                    'protein': { 'value': 4.3 },
                    'sodium': { 'value': 413.0 },
                    'calcium': { 'value': 3.0 },
                    'iron': { 'value': 8.0 }
                }, {
                    'name': 'Jelly bean',
                    'type': 'Candy',
                    'calories': { 'value': 375.0 },
                    'fat': { 'value': 0.0 },
                    'carbs': { 'value': 94.0 },
                    'protein': { 'value': 0.0 },
                    'sodium': { 'value': 50.0 },
                    'calcium': { 'value': 0.0 },
                    'iron': { 'value': 0.0 }
                }, {
                    'name': 'Lollipop',
                    'type': 'Candy',
                    'calories': { 'value': 392.0 },
                    'fat': { 'value': 0.2 },
                    'carbs': { 'value': 98.0 },
                    'protein': { 'value': 0.0 },
                    'sodium': { 'value': 38.0 },
                    'calcium': { 'value': 0.0 },
                    'iron': { 'value': 2.0 }
                }, {
                    'name': 'Honeycomb',
                    'type': 'Other',
                    'calories': { 'value': 408.0 },
                    'fat': { 'value': 3.2 },
                    'carbs': { 'value': 87.0 },
                    'protein': { 'value': 6.5 },
                    'sodium': { 'value': 562.0 },
                    'calcium': { 'value': 0.0 },
                    'iron': { 'value': 45.0 }
                }, {
                    'name': 'Donut',
                    'type': 'Pastry',
                    'calories': { 'value': 452.0 },
                    'fat': { 'value': 25.0 },
                    'carbs': { 'value': 51.0 },
                    'protein': { 'value': 4.9 },
                    'sodium': { 'value': 326.0 },
                    'calcium': { 'value': 2.0 },
                    'iron': { 'value': 22.0 }
                }, {
                    'name': 'KitKat',
                    'type': 'Candy',
                    'calories': { 'value': 518.0 },
                    'fat': { 'value': 26.0 },
                    'carbs': { 'value': 65.0 },
                    'protein': { 'value': 7.0 },
                    'sodium': { 'value': 54.0 },
                    'calcium': { 'value': 12.0 },
                    'iron': { 'value': 6.0 }
                }
            ]
        };

        this.selected = [];

        this.query = {
            order: 'name',
            limit: 5,
            page: 1
        };

        this.columns = [
            {
                name: 'Dessert',
                orderBy: 'name',
                unit: '100g serving'
            }, {
                descendFirst: true,
                name: 'Type',
                orderBy: 'type'
            }, {
                name: 'Calories',
                numeric: true,
                orderBy: 'calories.value'
            }, {
                name: 'Fat',
                numeric: true,
                orderBy: 'fat.value',
                unit: 'g'
            }, {
                name: 'Carbs',
                numeric: true,
                orderBy: 'carbs.value',
                unit: 'g'
            }, {
                name: 'Protein',
                numeric: true,
                orderBy: 'protein.value',
                trim: true,
                unit: 'g'
            }, {
                name: 'Sodium',
                numeric: true,
                orderBy: 'sodium.value',
                unit: 'mg'
            }, {
                name: 'Calcium',
                numeric: true,
                orderBy: 'calcium.value',
                unit: '%'
            }, {
                name: 'Iron',
                numeric: true,
                orderBy: 'iron.value',
                unit: '%'
            }];


    }

    onPageChange = (page, limit) => {

        console.log('Scope Page: ' + this.query.page + ' Scope Limit: ' + this.query.limit);
        console.log('Page: ' + page + ' Limit: ' + limit);

        let deferred = this.$q.defer();

        this.$timeout(function() {
            deferred.resolve();
        }, 2000);

        return deferred.promise;
    };

    /* tslint:disable */

    onOrderChange = (order) => {
        let deferred = this.$q.defer();

        this.$timeout(function() {
            deferred.resolve();
        }, 2000);

        return deferred.promise;
    };

    private notifications: {
        count: number;
        items:
        {
            date: string; title: string; text: string; icon: string; type: string; id: number;
        }[];
    };

    private currentPage: any;
    private currentSection: any;
    private openedSection: any;
    private toggleDisabled;
    private sections;

    /* tslint:enable */

    private desserts;
    private status;
    private query;
    private columns;
    private selected;

    show(event) {
        let confirm = this.$mdDialog.confirm()
            .title('Would you like to delete your debt?')
            .content('All of the banks have agreed to forgive you your debts.')
            .ariaLabel('Lucky day')
            .ok('Please do it!')
            .cancel('Sounds like a scam')
            .targetEvent(event);

        this.$mdDialog
            .show(confirm)
            .then(() => {
                this.status = 'OK';
            })
            .catch(() => {
                this.status = 'Cancel';
            })
            .finally(() => {
                this.$mdToast.show(
                    this.$mdToast
                        .simple()
                        .content(this.status)
                        .hideDelay(3000)
                );
            });
    }

    getTypes() {
        return ['Candy', 'Ice cream', 'Other', 'Pastry'];
    }
}

export {ListComponent};