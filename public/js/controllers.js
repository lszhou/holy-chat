/**********************************************************************
 * Login controller
 **********************************************************************/
holyChat.controller('LoginCtrl', function($scope, $rootScope, $http, $location) {
  // This object will be filled by the form
  $scope.user = {};

  // Register the login() function
  $scope.login = function(){
    $http.post('/login', {
      username: $scope.user.email,
      password: $scope.user.password,
    })
    .success(function(user){
      // No error: authentication OK
      $rootScope.message = 'Authentication successful!';
      $location.url('/');
    })
    .error(function(){
      // Error: authentication failed
      $rootScope.message = 'Authentication failed.';
      $location.url('/login');
    });
  };
});

/**********************************************************************
 * Register controller
 **********************************************************************/
holyChat.controller('RegisterCtrl', function($scope, $rootScope, $http, $location) {
  // This object will be filled by the form
  $scope.user = {};

  // Register the login() function
  $scope.register = function(){
    $http.post('/register', {
      username: $scope.user.email,
      password: $scope.user.password,
    })
    .success(function(user){
      // No error: authentication OK
      $rootScope.message = 'Authentication successful!';
      $location.url('/');
    })
    .error(function(){
      // Error: authentication failed
      $rootScope.message = 'Authentication failed.';
      $location.url('/login');
    });
  };
});

/**********************************************************************
 * Main controller
 **********************************************************************/
holyChat.controller('MainCtrl', function($scope, $http) {
  // List of users got from the server

  $scope.user = null;
  $http.get('/loggedin').success(function(user){
    $scope.user = user;
  });

  $scope.users = [];

  // Fill the array to display it in the page
  $http.get('/api/user').success(function(users){
    for (var i in users)
      $scope.users.push(users[i]);
  });
});

holyChat.controller('NavCtrl', function($scope, $http) {
  $scope.user = null;
  $http.get('/loggedin').success(function(user){
    $scope.user = user;
  });
});
