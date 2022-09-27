const express = require('express'); // express 모듈을 가져옵니다.
const app = express(); // app을 만들어줍니다.
const port = 27017; // 포트 번호를 설정해줍니다.
const bodyParser =require('body-parser');
const cookieParser = require('cookie-parser');
const {auth} = require('./middleware/auth');
const { User } = require("./models/User");

app.get('/', ( req, res) => res.send("Mongodb is now running")); 
// Mongodb가 켜졌는지 확인
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://yongtaewan:dyd107334*@coinbase.xnvax93.mongodb.net/?retryWrites=true&w=majority', {
}).then(() => console.log('MongoDB Connected...')).catch(err => console.log(err))


app.use(bodyParser.urlencoded({extended: false})); //application/x-www-form-urlencoded
app.use(bodyParser.json()); //application/json
app.use(cookieParser());



app.post('/api/users/register', (req, res) => {
    // post 요청을 처리해 응답을 주는 함수가 들어올 위치.
    
    // 회원가입할 때 필요한 정보들을 client에서 가져오면
    const user = new User(req.body);
    // 비밀번호를 암호화하여
    user.encryptPassword((err) => {
        // 그 것들을 데이터베이스에 넣어준다.
        user.save((err, userInfo) => {
            if (err) return res.json({ success: false, err });
            // 회원가입이 성공했다는 응답을 준다.
            return res.status(200).json({
                success: true
            });
        });
    });
});

app.post('/api/users/login', (req, res) => {
    // 요청된 이메일이 데이터베이스에 있는 지 확인한다.
    User.findOne({ email: req.body.email }, (err, user) => {
        if(!user) {
            return res.json({
                loginSucess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }
        
        // 요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인한다.
        user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch) {
                return res.json({ loginSucess: false, message: "비밀번호가 틀렸습니다." })
            }
            // 비밀번호가 맞다면 토큰을 생성한다.
            user.generateToken((err, user) => {
                if(err) return res.status(400).send(err);
                // 토큰을 쿠키에 저장한다.
                res.cookie("x_auth", user.token)
                    .status(200)
                    .json({ loginSucess: true, userId: user._id });
            });
        });
    });
});



app.get('/api/users/auth', auth, function(req, res) {
    // 미들웨어를 통과해서 여기까지 왔다는 것은 authentication이 성공했다는 의미
    res.status(200).json({
        // 이렇게 해놓으면 모든 페이지에서 유저 정보를 이용할 수 있음.
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    });
});

app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id },
        { token: "" },
        (err, user) => {
            if(err) return res.json({ success: false, err });
            return res.status(200).json({ success: true });
        });
});

