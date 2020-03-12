//引入express  创建服务器
const express = require('express');
const app = express();


// 创建数据库连接
const mysql = require('mysql');
const conn = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'1111',
    database:'library'
});
// 注册 解析表单的body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));

//设置跨域访问
app.all("*",function(req,res,next){
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin","*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers","content-type");
    //跨域允许的请求方式
    res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
    if (req.method.toLowerCase() === 'options')
        res.send(200);  //让options尝试请求快速结束
    else
        next();
});



//启动监听，端口号5000
app.listen(5000, ()=>{
    // 打印一下
    console.log('http://127.0.0.1:5000')
});

// 获取所有的数据
app.get('/api/getheros',(req,res) => {
    // 定义SQL语句
    const sqlStr = 'select * from member where id=1';
    conn.query(sqlStr,(err,results) => {
        console.log(results);
        console.log(results[0].email);//每一行查询结果保存到数字中，这个数组元素是一个对象，对象包括sql获得的属性

        if(err) return res.json({status:0,message:'获取失败',affectedRows:0});
        res.json({
            //在这里返回json对象给服务器，status是状态码，mssage是sql获得的内容属性，
            //results是sql获取的数据

            status:200,message:{username:results[0].username},affectedRows:0
        })
    })
});


// 根据ID 获取相关数据
app.get('/api/gethero',(req,res) => {
    const username = req.query.username;
    const sqlStr = 'select * from member where username = ?';
    conn.query(sqlStr, username, (err, results) => {
        if (err) return res.json({status: 0, message: '获取数据失败', affectedRows: 0});
        if (results.length !== 1) return res.json({status: 0, message: '数据不存在', affectedRows: 0});
        res.json({
            status: 200,
            message: results[0],
            affectedRows: 0
        })
    })
});


// 根据ID 更新指定数据    http://127.0.0.1:5000/api/delhero?id=3
app.get('/api/delhero',(req,res) => {
    const id = req.query.id;//对应数据库表项目名，然后再下面的conn.query(sqlStr,id,(err,results) => {})拼接sql
    const sqlStr = 'update member set userps = 3 where id=?';
    conn.query(sqlStr,id,(err,results) => {
        if(err) return res.json({status:0,message:'更新指定数据失败',affectedRows:0});
        if(results.affectedRows !== 1) return res.json({status:0,message:'更新指定数据失败',affectedRows:0});
        res.json({
            status:200,
            message:'更新指定数据成功',
            affectedRows:results.affectedRows
        })
    })
});

// 添加数据
//调用传一个body对象数据，用x-www-form格式
app.post('/api/addhero',(req,res) => {
    const hero = req.body;
    console.log(hero);
    const sqlStr = 'insert into member set ?';
    conn.query(sqlStr,hero,(err,results) => {
        if(err) return res.json({status:0,message:'添加失败',affectedRows:0});
        if(results.affectedRows !== 1) return res.json({status:200,message:'添加失败',affectedRows:0});
        res.json({
            status:200,
            message:'添加成功',
            affectedRows:results.affectedRows
        })
    })
});
//修改特定表项
//http://127.0.0.1:5000/api/updatehero用传一个body对象数据修改指定id，用x-www-form格式
app.post('/api/updatehero',(req,res) => {
    const sqlStr = 'update member set ? where id = ?';
    conn.query(sqlStr,[req.body,req.body.id],(err,results) => {
        if(err) return res.json({status:0,message:'更新失败',affevtedRows:0});
        //影响行数不等于1
        if(results.affectedRows !== 1) return res.json({status:0,message:'更新项目不存在',affectedRows:0});
        res.json({status:200,message:'更新成功',affectedRows:results.affectedRows})
    })
});


//删除
app.post('/api/deluser',(req,res) => {
    const sqlStr = 'delete from member where id=?';
    const id = req.query.id;
    conn.query(sqlStr,id,(err,results) => {
        if(err) return res.json({status:0,message:'删除失败',affevtedRows:0});
        //找不到行数为0
        if(results.affectedRows === 0) return res.json({status:0,message:'删除项目不存在',affectedRows:0});
        res.json({status:200,message:'删除成功',affectedRows:results.affectedRows})
    })
});




/*************************************链接图书馆项目api接口**********************************************************************/
// 根据username 查询    http://127.0.0.1:5000/api/login?username=***
app.get('/api/login',(req,res) => {
    const username = req.query.username;
    const password=req.query.password;
    const sqlStr = 'select username,userps from member where username = ? and password = ?';
    conn.query(sqlStr, [username,password], (err, results) => {
        if (err) return res.json({status: 100, message: '获取数据失败',ups:0, affectedRows: 0});
        if (results.length !== 1) return res.json({status: 200, message: '数据不存在或存在错误', ups:0,affectedRows: 0});
        res.json({
            status: 200,
            message: results[0],
            affectedRows: 0
        })
    })
});
//个人信息获取
app.get('/api/userinfo',(req,res) => {
    const username = req.query.username;
    const sqlStr = 'select username,email,phone,userps from member where username = ? ';
    conn.query(sqlStr, username, (err, results) => {
        if (err) return res.json({status: 100, message: '获取数据失败',ups:0, affectedRows: 0});
        if (results.length !== 1) return res.json({status: 200, message: '数据不存在或存在错误', ups:0,affectedRows: 0});
        res.json({
            status: 200,
            message: results[0],
            affectedRows: 0
        })
    })
});
//注册接口
app.post('/api/adduser',(req,res) => {
    const user = req.body;
    console.log(user);
    const sqlStr = 'insert into member set ?';
    conn.query(sqlStr,user,(err,results) => {
        if(err) return res.json({status:101,message:'添加失败',affectedRows:0});
        if(results.affectedRows !== 1) return res.json({status:100,message:'添加失败',affectedRows:0});
        res.json({
            status:200,
            message:'添加成功',
            affectedRows:results.affectedRows
        })
    })
});
///获取所有图书
app.get('/api/getallbook',(req,res) => {
    // 定义SQL语句
    const sqlStr = 'select * from librarybook';
    conn.query(sqlStr,(err,results) => {
        console.log(results);
        console.log(results[0]);//每一行查询结果保存到数字中，这个数组元素是一个对象，对象包括sql获得的属性
        if(err) return res.json({status:0,message:'获取失败',affectedRows:0});
        res.json({
            //在这里返回json对象给服务器，status是状态码，mssage是sql获得的内容属性，
            //results是sql获取的数据

            status:200,message:{results},affectedRows:0
        })
    })
});