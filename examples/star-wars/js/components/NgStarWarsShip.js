/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only.  Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */


import Relay from 'generic-relay';
import angular from 'angular';

angular.module('starWarsShip', [])
.directive('starWarsShip', starWarsShip);

const StarWarsShipContainer = Relay.createGenericContainer('StarWarsShip', {
  fragments: {
    ship: () => Relay.QL`
       fragment on Ship {
         name
       }
    `,
  },
});


function starWarsShip() {
  return {
    restrict: 'E',
    scope: {},
    bindToController: {
      ship: '=',
    },
    controllerAs: 'vm',
    controller: controllerFn,
    template: '<div>Ship Name {{vm.relayData.ship.name}}</div>',
  };

  function controllerFn($scope, $rootScope) {
    const updateListener = (state) => {
      if (!$rootScope.$$phase) {
        $scope.$apply(() => {this.relayData = state.data;});
      }else {
        this.relayData = state.data;
      }
    };
    const starWarsShip = new StarWarsShipContainer(updateListener);
    $scope.$watch('vm.ship', (newValue, oldValue) => {
      console.log(newValue);
      if (newValue == null) {
        return;
      }
      starWarsShip.update({fragmentInput:{ship: this.ship}, route: $rootScope.route});
    },
    false);
  }
}


export default StarWarsShipContainer;
