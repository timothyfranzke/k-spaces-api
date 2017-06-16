var BASE_URL = window.location.origin;
var AUTH_URL = "http://localhost:8080";
var ENTITY = BASE_URL + 'entity/';
var LOCATION = BASE_URL + '/api/location';
var SPACES = BASE_URL + '/api/spaces';
var USER = BASE_URL + '/api/user';
var MESSAGE = BASE_URL + '/api/message';
var EVENT = BASE_URL + '/api/event';
var SEARCH = BASE_URL + '/api/search';
var GEN_PW = 'api/generate-password';
var IMAGE = 'http://www.franzkedesigner.com/kspaces-img/CreateImageService.php';
var REGISTER = AUTH_URL + '/register';
var LOGIN = AUTH_URL + '/login';

//messages
var UPDATE_MESSAGE = "updated successfully";
var CREATE_MESSAGE = "created successfully";
var DELETE_MESSAGE = "deleted successfully";
var SENT_MESSAGE = "sent successfully";

var SPACE_MESSAGE = "Space has been ";
var LOCATION_MESSAGE = "Location has been ";
var USER_MESSAGE = "User has been ";
var EVENT_MESSAGE = "Event has been ";
var MESSAGE_MESSAGE = "Message has been ";

var NAME_HAS_BEEN = function(name){ return name + " has been "};

var ERROR_MESSAGE = "An error has occurred";

var LOCATION_CREATE_MESSAGE = LOCATION_MESSAGE + CREATE_MESSAGE;
var LOCATION_UPDATE_MESSAGE = LOCATION_MESSAGE + UPDATE_MESSAGE;
var LOCATION_DELECT_MESSAGE = LOCATION_MESSAGE + DELETE_MESSAGE;

var SPACE_DELETE_MESSAGE = SPACE_MESSAGE + DELETE_MESSAGE;
var SPACE_UPDATE_MESSAGE = SPACE_MESSAGE + UPDATE_MESSAGE;
var SPACE_CREATE_MESSAGE = SPACE_MESSAGE + CREATE_MESSAGE;

var USER_DELETE_MESSAGE = USER_MESSAGE + DELETE_MESSAGE;
var USER_UPDATE_MESSAGE = USER_MESSAGE + UPDATE_MESSAGE;
var USER_CREATE_MESSAGE = USER_MESSAGE + CREATE_MESSAGE;

var EVENT_DELETE_MESSAGE = EVENT_MESSAGE + DELETE_MESSAGE;
var EVENT_UPDATE_MESSAGE = EVENT_MESSAGE + UPDATE_MESSAGE;
var EVENT_CREATE_MESSAGE = EVENT_MESSAGE + CREATE_MESSAGE;

var MESSAGE_SENT_MESSAGE = MESSAGE_MESSAGE + SENT_MESSAGE;

var UPDATED_MESSAGE = function(name){return NAME_HAS_BEEN(name) + UPDATE_MESSAGE};
var CREATED_MESSAGE = function(name){return NAME_HAS_BEEN(name) + CREATE_MESSAGE};
var DELETED_MESSAGE = function(name){return NAME_HAS_BEEN(name) + DELETE_MESSAGE};

var TOAST_TYPES = {
    ERROR: 1,
    SUCCESS: 2
};