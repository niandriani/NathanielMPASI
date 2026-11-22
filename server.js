// Server tanpa dependensi: menyajikan folder public dan menyimpan checklist bersama di file JSON.
const http=require('http'),fs=require('fs'),path=require('path');
const PORT=process.env.PORT||3000, DATA=process.env.DATA_DIR||path.join(__dirname,'data'), FILE=path.join(DATA,'checks.json');
const PUB=__dirname, ALLOW=new Set(['/index.html','/bahan.json']);
const TYPES={'.html':'text/html; charset=utf-8','.json':'application/json','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.ico':'image/x-icon'};
fs.mkdirSync(DATA,{recursive:true});
let db={};try{db=JSON.parse(fs.readFileSync(FILE,'utf8'))}catch(e){}
const save=()=>{try{fs.writeFileSync(FILE+'.tmp',JSON.stringify(db));fs.renameSync(FILE+'.tmp',FILE)}catch(e){console.error(e)}};
const send=(res,code,obj)=>{res.writeHead(code,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(obj))};
http.createServer((req,res)=>{
  const u=new URL(req.url,'http://x');
  if(u.pathname==='/api/checks'){
    if(req.method==='GET'){const d=u.searchParams.get('date')||'';return send(res,200,{items:Object.keys(db[d]||{})})}
    if(req.method==='POST'){let b='';req.on('data',c=>{b+=c;if(b.length>1e4)req.destroy()});req.on('end',()=>{
      try{const j=JSON.parse(b);if(!/^\d{4}-\d{2}-\d{2}$/.test(j.date))throw 0;
        if(j.reset)delete db[j.date];
        else if(/^[a-z0-9]{2,20}$/.test(j.item)){db[j.date]=db[j.date]||{};if(j.done)db[j.date][j.item]=1;else delete db[j.date][j.item]}
        else throw 0;
        const keys=Object.keys(db).sort();while(keys.length>60)delete db[keys.shift()];
        save();send(res,200,{ok:true})}catch(e){send(res,400,{error:'bad request'})}});return}
    return send(res,405,{error:'method'})}
  let p=path.normalize(decodeURIComponent(u.pathname)).replace(/^(\.\.[\/\\])+/,'');if(p==='/'||p==='\\')p='/index.html';
  if(!ALLOW.has(p.replace(/\\/g,'/')))return send(res,404,{});const f=path.join(PUB,p);if(!f.startsWith(PUB))return send(res,403,{});
  fs.readFile(f,(e,data)=>{if(e){res.writeHead(404);return res.end('Not found')}
    res.writeHead(200,{'Content-Type':TYPES[path.extname(f)]||'application/octet-stream'});res.end(data)});
}).listen(PORT,()=>console.log('Dunia Nathaniel jalan di port '+PORT));
