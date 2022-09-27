// User.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,    // space를 없애주는 역할
        unique: 1
    },
    password: {
        type: String
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
});



// 비밀번호 암호화.

const saltRounds = 10;

userSchema.methods.encryptPassword = function(cb) {
    let user = this;
	
    // bcrypt로 암호화할 수 있는 salt를 생성한다.
    bcrypt.genSalt(saltRounds, function(err, salt) {
        if (err) return cb(err);
		
        // 생성한 salt를 이용하여 암호화된 hash를 생성한다.
        bcrypt.hash(user.password, salt, function(err, hash) {
            if(err) throw new Error(err);
            user.password = hash;
            cb()
        });
    });
};

// models/User.js

// 유저가 입력한 패스워드와 데이터베이스의 패스워드를 비교한 후 true/false를 콜백함수로 넘겨줌
userSchema.methods.comparePassword = function(plainpassword, cb) {
    bcrypt.compare(plainpassword, this.password, function(err, isMatch) {
        if(err) return cb(err);
        cb(null, isMatch);
    });
};


// models/User.js
const jwt = require('jsonwebtoken');

// jwt를 통해 유저의 아이디로 토큰을 만든 후 저장
userSchema.methods.generateToken = function(cb) {
    let user = this;

    let token = jwt.sign(user._id.toHexString(), 'secretToken');
    user.token = token;
    user.save(function(err, user) {
        if(err) return cb(err);
        cb(null, user);
    });
};

// models/Users.js

// token을 이용해 유저를 찾음.
userSchema.statics.findByToken = function(token, cb) {
    let user = this;
    jwt.verify(token, 'secretToken', function(err, decoded) {
        if(err) return cb(err);
        user.findOne({ "_id": decoded, "token": token }, function(err, user) {
            if(err) return cb(err);
            cb(null, user);
        });
    });
};

const User = mongoose.model('User', userSchema);
module.exports = { User };