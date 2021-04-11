
// get dependencies
const http = require("http");
let dateFormat = require('dateformat');
let mongo = require('mongodb');
let _mutation_ = require('./mutation');

// mongoDB client and connection string
let MongoClient = mongo.MongoClient;
let str_conn = 'mongodb://jccp33:jccp33@localhost:27017/ADN_Mutations?authSource=admin';
// node.js server and port
const host = 'localhost';
const port = 8000;

// create listener object
const requestListener = function(req, res){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    res.writeHead(200);

    if(req.method === 'POST'){
        let service = req.url.substring(1);
        if(service === "mutation"){
            req.on('data', (data) => {
                data = data + "";
                let adn = data.split('=')[1];
                if(adn.length === 36){
                    let array_strings = _mutation_.arrayOfStrings(adn, 6);
                    let mutation = _mutation_.hasMutation(array_strings);
                    mutation.ADN = adn;
                    mutation.date = dateFormat(new Date(), "yyyy-mm-dd");
                    
                    // save adn in mongoDB
                    MongoClient.connect(str_conn, (error, db) => {
                        if(error){
                            console.log(error);
                        }else{
                            let dbo = db.db("ADN_Mutations");
                            dbo.collection("ADN_Mutations").insertOne(mutation, function(err, res) {
                                if (err) throw err;
                                //console.log(res);
                                db.close();
                            });
                        }
                    });
                    
                    res.end(JSON.stringify(mutation));
                }else{
                    res.end(JSON.stringify({response:403, text:"Forbidden", message:"Invalid String"}));
                }
            });
        }else if(service === "stats"){
            MongoClient.connect(str_conn, (error, db) => {
                if(error){
                    res.end(JSON.stringify({response:403, text:"Forbidden", text:"ERROR", message:error.message}));
                    console.log(error);
                }else{
                    let dbo = db.db("ADN_Mutations");
                    dbo.collection("ADN_Mutations").find().toArray(function(err, result) {
                        if(err){
                            res.end(JSON.stringify({response:403, text:"Forbidden", text:"ERROR", message:err.message}));
                        }else{
                            let stats = {};
                            stats.count_mutations = 0;
                            stats.count_no_mutations = 0;
                            for(let i=0; i<result.length; i++){
                                if(result[i].response === 200){
                                    stats.count_mutations++;
                                }else{
                                    stats.count_no_mutations++;
                                }
                            }
                            stats.ratio = stats.count_mutations / stats.count_no_mutations;
                            res.end(JSON.stringify({response:200, text:"OK", message:"STATS", data:stats}));
                        }
                        db.close();
                    });
                }
            });
        }else if(service === "list"){
            MongoClient.connect(str_conn, (error, db) => {
                if(error){
                    res.end(JSON.stringify({response:403, text:"Forbidden", text:"ERROR", message:error.message}));
                    console.log(error);
                }else{
                    let dbo = db.db("ADN_Mutations");
                    dbo.collection("ADN_Mutations").find().sort({'_id': -1}).limit(10).toArray(function(err, result) {
                        if(err){
                            res.end(JSON.stringify({response:403, text:"Forbidden", text:"ERROR", message:err.message}));
                        }else{
                            res.end(JSON.stringify({response:200, text:"OK", message:"ARRAY", data:result}));
                        }
                        db.close();
                    });
                }
            });
        }else{
            res.end(JSON.stringify({response:403, text:"Forbidden", message:"Invalid Service"}));
        }
    }else{
        res.end(JSON.stringify({response:403, text:"Forbidden", message:"Invalid Method"}));
    }
};

// create server with listener object
const server = http.createServer(requestListener);
// set server to listener
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}/mutation`);
});
