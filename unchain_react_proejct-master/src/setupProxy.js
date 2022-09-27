const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app){
    app.use (
        createProxyMiddleware( './components/articles' , {
            target : 'http://localhost:3000',
            changeOrigin : true
        })
    )
}