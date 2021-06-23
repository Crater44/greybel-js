const computer = require('./api/computer');
const computerMetaTransformer = require('./transformer/computer-meta');
const tools = require('./tools');

const Computer = function(id) {
	const me = this;

	me.id = id;
	me.users = null;
	me.fileSystem = null;
	me.configOS = null;
	me.Hardware = null;

	return me;
};

Computer.prototype.start = function() {
	const me = this;
	
	me.load();
};

Computer.prototype.load = function() {
	const me = this;
	const c = computer.get(me.id);
	const meta = computerMetaTransformer(c);

	me.users = meta.users;
	me.fileSystem = meta.fileSystem;
	me.configOS = meta.configOS;
	me.Hardware = meta.Hardware;
};

Computer.prototype.login = function(username, password) {
	const me = this;
	const user = me.users.find(function(item) {
		return item.username === username;
	});

	if (user && user.password === tools.md5(password)) {
		return user;
	}
};

Computer.prototype.getDefaultUser = function() {
	const me = this;
	
	return me.users[me.users.length - 1];
};

Computer.prototype.getHome = function(username) {
	const me = this;
	const name = username ? username : 'guest';

	if (name === 'root') {
		return ['', 'root'].join('/');
	}

	return ['', 'home', name].join('/');
};

module.exports = Computer;