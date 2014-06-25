/**
 * Rooms Controller
 *
 * @param {Object} $scope
 * @param {Object} $location
 * @param {RoomRepository} repository
 * @param {SocketClient} client
 */
function RoomsController($scope, $location, repository, client)
{
    this.$scope     = $scope;
    this.$location  = $location;
    this.repository = repository;
    this.client     = client;

    // Binding:
    this.createRoom   = this.createRoom.bind(this);
    this.joinRoom     = this.joinRoom.bind(this);
    this.spectateRoom = this.spectateRoom.bind(this);
    this.detachEvents = this.detachEvents.bind(this);
    this.applyScope   = this.applyScope.bind(this);

    this.$scope.$on('$destroy', this.detachEvents);

    this.attachEvents();

    // Hydrating the scope:
    this.$scope.rooms    = this.repository.rooms;
    this.$scope.submit   = this.createRoom;
    this.$scope.join     = this.joinRoom;
    this.$scope.spectate = this.spectateRoom;

    this.$scope.curvytron.bodyClass = null;
}

/**
 * Attach Events
 */
RoomsController.prototype.attachEvents = function()
{
    this.repository.on('room:new', this.applyScope);
    this.repository.on('room:close', this.applyScope);
    this.repository.on('room:join', this.applyScope);
    this.repository.on('room:leave', this.applyScope);
    this.repository.on('room:game:start', this.applyScope);
    this.repository.on('room:game:end', this.applyScope);
};

/**
 * Attach Events
 */
RoomsController.prototype.detachEvents = function()
{
    this.repository.off('room:new', this.applyScope);
    this.repository.off('room:close', this.applyScope);
    this.repository.off('room:join', this.applyScope);
    this.repository.off('room:leave', this.applyScope);
    this.repository.off('room:game:start', this.applyScope);
    this.repository.off('room:game:end', this.applyScope);
};

/**
 * Create a room
 */
RoomsController.prototype.createRoom = function(e)
{
    if (this.$scope.name) {
        var $scope = this.$scope,
            controller = this;

        this.repository.create(this.$scope.name, function (result) {
            if (result.success) {
                $scope.name = null;
                controller.joinRoom({name: result.room});
            } else {
                console.log('Error');
            }
        });
    }
};

/**
 * Join a room
 */
RoomsController.prototype.joinRoom = function(room)
{
    this.$location.path('/room/' + room.name);
};

/**
 * Spectact a room
 */
RoomsController.prototype.spectateRoom = function(room)
{
    this.$location.path('/game/' + room.name);
};

/**
 * Apply scope
 */
RoomsController.prototype.applyScope = function()
{
    this.$scope.$apply();
};
