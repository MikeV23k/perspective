import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowLeft, ArrowUp, Bell, Bookmark, Check, ChevronRight, Clock3,
  Compass, Flame, Hash, Home, Info, Lightbulb, LogIn, Menu, MessageCircle,
  MoreHorizontal, PenLine, Search, Send, Settings, ShieldCheck, Sparkles,
  TrendingUp, UserRound, Users, X, Zap
} from "lucide-react";
import "./styles.css";

const categories = [
  { id:"actualidad", name:"Actualidad", icon:"🌎", desc:"El mundo, con contexto." },
  { id:"tecnologia", name:"Tecnología", icon:"💻", desc:"Tecnología que importa." },
  { id:"aprendizaje", name:"Aprendizaje", icon:"📚", desc:"Ideas que amplían tu mundo." },
  { id:"espiritualidad", name:"Espiritualidad", icon:"🙏", desc:"Fe, propósito y reflexión." },
  { id:"desarrollo", name:"Desarrollo", icon:"🌱", desc:"Crecer con intención." }
];

const initialPosts = [
  {
    id:1, category:"tecnologia", title:"La IA está cambiando el trabajo. ¿Qué habilidades serán realmente valiosas?",
    excerpt:"Más allá de la carrera por usar la última herramienta, quizá la ventaja esté en saber formular problemas, verificar resultados y tomar mejores decisiones.",
    author:"Elena R.", initials:"ER", time:"hace 42 min", comments:28, likes:94, read:"6 min", featured:true,
    tags:["IA","Futuro del trabajo"], saved:false, hot:true
  },
  {
    id:2, category:"actualidad", title:"¿Estamos entrando en una nueva etapa de fragmentación del mundo?",
    excerpt:"Economía, tecnología, energía y geopolítica están cada vez más conectadas. Una conversación para separar tendencias reales de titulares alarmistas.",
    author:"Marco Díaz", initials:"MD", time:"hace 1 h", comments:41, likes:118, read:"8 min", tags:["Geopolítica","Economía"], saved:false, hot:true
  },
  {
    id:3, category:"aprendizaje", title:"Aprender a pensar mejor: cinco preguntas antes de aceptar una afirmación",
    excerpt:"No se trata de desconfiar de todo. Se trata de desarrollar un método sencillo para distinguir evidencia, interpretación y opinión.",
    author:"Sofía", initials:"SO", time:"hace 2 h", comments:17, likes:76, read:"5 min", tags:["Pensamiento crítico"], saved:false
  },
  {
    id:4, category:"espiritualidad", title:"¿Qué significa tener paciencia cuando no vemos resultados?",
    excerpt:"Una conversación serena sobre espera, propósito y la diferencia entre paciencia y pasividad.",
    author:"Daniel P.", initials:"DP", time:"hace 3 h", comments:32, likes:88, read:"7 min", tags:["Reflexión","Propósito"], saved:false
  },
  {
    id:5, category:"desarrollo", title:"El progreso invisible: por qué pequeños hábitos terminan cambiando una vida",
    excerpt:"No todo crecimiento se nota inmediatamente. Hablemos de sistemas, consistencia y de cómo medir avances sin obsesionarnos.",
    author:"Laura M.", initials:"LM", time:"hace 4 h", comments:23, likes:69, read:"6 min", tags:["Hábitos","Crecimiento"], saved:false
  },
  {
    id:6, category:"tecnologia", title:"¿Qué debería aprender alguien que quiere seguir siendo relevante en tecnología?",
    excerpt:"Programación, datos, IA, comunicación, criterio. Abrimos la discusión con una pregunta incómoda: ¿qué habilidades están perdiendo valor?",
    author:"Andrés", initials:"AN", time:"hace 5 h", comments:36, likes:102, read:"9 min", tags:["Carrera","Tecnología"], saved:false
  }
];

const trends = [
  ["#InteligenciaArtificial", "1.8k conversaciones"],
  ["#PensamientoCrítico", "924 conversaciones"],
  ["#FuturoDelTrabajo", "716 conversaciones"],
  ["#Geopolítica", "603 conversaciones"],
  ["#AprenderMejor", "482 conversaciones"]
];

function App(){
  const [posts,setPosts] = useState(initialPosts);
  const [view,setView] = useState("home");
  const [category,setCategory] = useState(null);
  const [query,setQuery] = useState("");
  const [mobileMenu,setMobileMenu] = useState(false);
  const [compose,setCompose] = useState(false);
  const [notice,setNotice] = useState("");
  const [selected,setSelected] = useState(null);

  const filtered = useMemo(()=>{
    let list = posts;
    if(category) list = list.filter(p=>p.category===category);
    if(view==="saved") list = list.filter(p=>p.saved);
    if(view==="trending") list = [...list].sort((a,b)=>b.likes-a.likes);
    if(query.trim()){
      const q=query.toLowerCase();
      list=list.filter(p => `${p.title} ${p.excerpt} ${p.author} ${p.tags.join(" ")}`.toLowerCase().includes(q));
    }
    return list;
  },[posts,category,view,query]);

  function toast(msg){ setNotice(msg); setTimeout(()=>setNotice(""),2600); }
  function toggleSave(id){
    setPosts(ps=>ps.map(p=>p.id===id?{...p,saved:!p.saved}:p));
  }
  function like(id){
    setPosts(ps=>ps.map(p=>p.id===id?{...p,likes:p.likes+1}:p));
  }
  function openPost(p){ setSelected(p); setView("post"); window.scrollTo({top:0,behavior:"smooth"}); }
  function navigate(v,cat=null){
    setView(v); setCategory(cat); setSelected(null); setMobileMenu(false);
    window.scrollTo({top:0,behavior:"smooth"});
  }

  return <div className="app">
    <Header query={query} setQuery={setQuery} onMenu={()=>setMobileMenu(true)} onCompose={()=>setCompose(true)} />
    <div className="layout">
      <Sidebar view={view} category={category} navigate={navigate} />
      <main className="main">
        {view==="post" && selected
          ? <PostDetail post={selected} onBack={()=>navigate("home")} onSave={toggleSave} onLike={like} toast={toast}/>
          : view==="home"
            ? <HomePage posts={filtered} openPost={openPost} onSave={toggleSave} onLike={like} onCompose={()=>setCompose(true)} navigate={navigate}/>
            : <FeedPage title={category ? categories.find(c=>c.id===category)?.name : view==="saved"?"Guardados":"En tendencia"} subtitle={category ? categories.find(c=>c.id===category)?.desc : view==="saved"?"Tus conversaciones guardadas para volver a ellas.":"Las conversaciones que están generando más interés."} posts={filtered} openPost={openPost} onSave={toggleSave} onLike={like}/>
        }
      </main>
      <RightRail trends={trends} categories={categories} navigate={navigate} />
    </div>
    {mobileMenu && <MobileMenu navigate={navigate} close={()=>setMobileMenu(false)} />}
    {compose && <Compose onClose={()=>setCompose(false)} onPublish={(data)=>{
      const newPost={...data,id:Date.now(),author:"Tú",initials:"TU",time:"ahora",comments:0,likes:0,read:"3 min",saved:false};
      setPosts(p=>[newPost,...p]); setCompose(false); navigate("home"); toast("Tu publicación fue creada."); 
    }}/>}
    {notice && <div className="toast"><Check size={17}/>{notice}</div>}
  </div>
}

function Header({query,setQuery,onMenu,onCompose}){
 return <header className="header">
   <div className="header-inner">
     <button className="mobile-menu-btn icon-btn" onClick={onMenu}><Menu/></button>
     <button className="brand" onClick={()=>location.reload()}>
       <span className="brand-mark">P</span><span>perspectiva</span>
     </button>
     <div className="search">
       <Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar conversaciones, temas o personas"/>
       {query && <button onClick={()=>setQuery("")}><X size={16}/></button>}
     </div>
     <div className="header-actions">
       <button className="write-btn" onClick={onCompose}><PenLine size={17}/> <span>Crear</span></button>
       <button className="icon-btn"><Bell size={19}/><i className="dot"/></button>
       <div className="avatar avatar-sm">TU</div>
     </div>
   </div>
 </header>
}

function Sidebar({view,category,navigate}){
 return <aside className="sidebar">
   <nav>
     <NavItem active={view==="home"} icon={<Home/>} label="Inicio" onClick={()=>navigate("home")}/>
     <NavItem active={view==="trending"} icon={<TrendingUp/>} label="En tendencia" onClick={()=>navigate("trending")}/>
     <NavItem active={view==="saved"} icon={<Bookmark/>} label="Guardados" onClick={()=>navigate("saved")}/>
   </nav>
   <div className="side-section">
     <div className="side-title">Explorar</div>
     {categories.map(c=><button key={c.id} className={`category-link ${category===c.id?"active":""}`} onClick={()=>navigate("category",c.id)}>
       <span>{c.icon}</span><span>{c.name}</span>
     </button>)}
   </div>
   <div className="side-section community-note">
     <div className="mini-icon"><Sparkles size={16}/></div>
     <strong>Una comunidad diferente</strong>
     <p>Ideas, contexto y conversaciones que valen tu tiempo.</p>
   </div>
   <div className="sidebar-bottom">
     <button><Settings size={16}/> Preferencias</button>
     <button><ShieldCheck size={16}/> Normas de la comunidad</button>
   </div>
 </aside>
}

function NavItem({active,icon,label,onClick}){ return <button className={`nav-item ${active?"active":""}`} onClick={onClick}>{icon}<span>{label}</span></button> }

function HomePage({posts,openPost,onSave,onLike,onCompose,navigate}){
 return <div className="page">
   <section className="hero">
     <div className="eyebrow"><span className="eyebrow-dot"/> Comunidad abierta</div>
     <h1>Menos ruido.<br/><em>Más pensamiento.</em></h1>
     <p>Un lugar para entender lo que pasa, aprender cosas nuevas y tener conversaciones que dejan algo.</p>
     <div className="hero-actions"><button className="primary-btn" onClick={onCompose}><PenLine size={17}/> Iniciar una conversación</button><button className="ghost-btn" onClick={()=>navigate("trending")}>Explorar temas <ArrowUp className="rotate-45" size={16}/></button></div>
   </section>
   <div className="section-head"><div><span className="kicker">PARA TI</span><h2>Conversaciones destacadas</h2></div><button className="text-btn" onClick={()=>navigate("trending")}>Ver todo <ChevronRight size={16}/></button></div>
   <div className="post-grid">{posts.slice(0,4).map(p=><PostCard key={p.id} post={p} openPost={openPost} onSave={onSave} onLike={onLike}/>)}</div>
   <section className="join-banner"><div><div className="join-icon"><Users size={20}/></div><h2>Tu perspectiva importa.</h2><p>La comunidad mejora cuando personas distintas se toman el tiempo de pensar, preguntar y aportar.</p></div><button className="primary-btn" onClick={onCompose}>Participar</button></section>
   <div className="section-head latest-head"><div><span className="kicker">RECIENTES</span><h2>Lo que está pasando</h2></div><button className="text-btn" onClick={()=>navigate("home")}>Actualizar <Zap size={15}/></button></div>
   <div className="feed-list">{posts.slice(4).map(p=><CompactPost key={p.id} post={p} openPost={openPost} onSave={onSave} onLike={onLike}/>)}</div>
 </div>
}

function FeedPage({title,subtitle,posts,openPost,onSave,onLike}){
 return <div className="page">
   <div className="feed-heading"><div><span className="kicker">EXPLORAR</span><h1>{title}</h1><p>{subtitle}</p></div><button className="filter-btn"><Hash size={16}/> Más recientes <ChevronRight size={15}/></button></div>
   {posts.length===0 ? <EmptyState/> : <div className="feed-list large">{posts.map(p=><CompactPost key={p.id} post={p} openPost={openPost} onSave={onSave} onLike={onLike}/>)}</div>}
 </div>
}

function PostCard({post,openPost,onSave,onLike}){
 const cat=categories.find(c=>c.id===post.category);
 return <article className={`post-card ${post.featured?"featured":""}`}>
   <div className="card-top"><span className="pill">{cat.icon} {cat.name}</span>{post.hot&&<span className="hot"><Flame size={14}/> Popular</span>}</div>
   <button className="post-title" onClick={()=>openPost(post)}>{post.title}</button>
   <p>{post.excerpt}</p>
   <div className="tags">{post.tags.map(t=><span key={t}>#{t}</span>)}</div>
   <div className="post-meta"><Avatar initials={post.initials}/><div><strong>{post.author}</strong><span>{post.time} · {post.read}</span></div><button className="save-btn" onClick={()=>onSave(post.id)}>{post.saved?<Bookmark size={17} fill="currentColor"/>:<Bookmark size={17}/>}</button></div>
   <div className="engagement"><button onClick={()=>onLike(post.id)}><ArrowUp size={16}/> {post.likes}</button><button onClick={()=>openPost(post)}><MessageCircle size={16}/> {post.comments}</button><span><Clock3 size={14}/> {post.read}</span></div>
 </article>
}

function CompactPost({post,openPost,onSave,onLike}){
 const cat=categories.find(c=>c.id===post.category);
 return <article className="compact-post">
   <div className="compact-icon">{cat.icon}</div>
   <div className="compact-body"><div className="compact-label">{cat.name} · {post.time}</div><button className="compact-title" onClick={()=>openPost(post)}>{post.title}</button><p>{post.excerpt}</p>
   <div className="compact-bottom"><span>{post.author}</span><span>·</span><button onClick={()=>onLike(post.id)}><ArrowUp size={14}/> {post.likes}</button><button onClick={()=>openPost(post)}><MessageCircle size={14}/> {post.comments}</button><button onClick={()=>onSave(post.id)} className={post.saved?"saved":""}><Bookmark size={14}/></button></div></div>
 </article>
}

function PostDetail({post,onBack,onSave,onLike,toast}){
 const cat=categories.find(c=>c.id===post.category);
 const [comment,setComment]=useState("");
 const [comments,setComments]=useState([
   {a:"Carla",i:"CA",t:"Buen punto. Creo que la parte más interesante es cómo cambia nuestra relación con la información.",time:"hace 18 min"},
   {a:"Luis M.",i:"LM",t:"Me gustaría ver más ejemplos concretos sobre esto. ¿Qué habilidades pondrían ustedes primero?",time:"hace 11 min"},
   {a:"Nadia",i:"NA",t:"Estoy de acuerdo con parte del argumento, aunque creo que hay otra variable que estamos subestimando.",time:"hace 4 min"}
 ]);
 return <div className="article-page">
   <button className="back-btn" onClick={onBack}><ArrowLeft size={17}/> Volver a conversaciones</button>
   <article className="article">
     <div className="article-label"><span className="pill">{cat.icon} {cat.name}</span>{post.hot&&<span className="hot"><Flame size={14}/> En tendencia</span>}</div>
     <h1>{post.title}</h1>
     <div className="article-author"><Avatar initials={post.initials}/><div><strong>{post.author}</strong><span>{post.time} · {post.read} de lectura</span></div><button className="save-large" onClick={()=>onSave(post.id)}>{post.saved?<><Bookmark fill="currentColor" size={17}/> Guardado</>:<><Bookmark size={17}/> Guardar</>}</button></div>
     <div className="article-content">
       <p className="lead">{post.excerpt}</p>
       <p>Las conversaciones importantes rara vez caben en una frase. Este espacio existe para explorar la pregunta con calma, contrastar perspectivas y separar lo que sabemos de lo que creemos saber.</p>
       <blockquote><Lightbulb size={21}/><div><strong>Una buena conversación no necesita que todos piensen igual.</strong><br/>Necesita que todos estén dispuestos a pensar.</div></blockquote>
       <h2>La pregunta que queda abierta</h2>
       <p>¿Cómo podemos aprovechar las oportunidades que presenta este tema sin ignorar sus costes, límites o consecuencias? Comparte ejemplos, fuentes o experiencias que ayuden a hacer la conversación más concreta.</p>
     </div>
     <div className="article-actions"><button onClick={()=>onLike(post.id)} className="reaction"><ArrowUp size={18}/> {post.likes} <span>Me interesa</span></button><button className="reaction"><MessageCircle size={18}/> {comments.length} <span>Comentarios</span></button><button className="reaction" onClick={()=>onSave(post.id)}><Bookmark size={18}/><span>{post.saved?"Guardado":"Guardar"}</span></button></div>
   </article>
   <section className="discussion"><div className="discussion-head"><div><span className="kicker">DISCUSIÓN</span><h2>{comments.length} comentarios</h2></div><button className="sort-btn">Más relevantes <ChevronRight size={15}/></button></div>
     <div className="comment-box"><Avatar initials="TU"/><div><textarea value={comment} onChange={e=>setComment(e.target.value)} placeholder="Aporta una idea, pregunta o perspectiva..."/><div className="comment-tools"><span>Respeta otras perspectivas y aporta valor.</span><button disabled={!comment.trim()} onClick={()=>{setComments(c=>[{a:"Tú",i:"TU",t:comment,time:"ahora"},...c]);setComment("");toast("Comentario publicado.")}}><Send size={15}/> Publicar</button></div></div></div>
     <div className="comments">{comments.map((c,i)=><div className="comment" key={i}><Avatar initials={c.i}/><div className="comment-body"><div className="comment-name">{c.a} <span>· {c.time}</span></div><p>{c.t}</p><div className="comment-actions"><button><ArrowUp size={13}/> 4</button><button>Responder</button><button><MoreHorizontal size={15}/></button></div></div></div>)}</div>
   </section>
 </div>
}

function RightRail({trends,categories,navigate}){
 return <aside className="right-rail">
   <section className="rail-card"><div className="rail-title"><span>🔥</span> En conversación</div>{trends.slice(0,4).map((t,i)=><button className="trend" key={t[0]} onClick={()=>{}}><small>0{i+1}</small><div><strong>{t[0]}</strong><span>{t[1]}</span></div><ChevronRight size={15}/></button>)}<button className="see-all" onClick={()=>navigate("trending")}>Ver tendencias <ChevronRight size={15}/></button></section>
   <section className="rail-card"><div className="rail-title"><Compass size={17}/> Explora por tema</div>{categories.map(c=><button className="rail-cat" key={c.id} onClick={()=>navigate("category",c.id)}><span>{c.icon}</span><div><strong>{c.name}</strong><small>{c.desc}</small></div><ChevronRight size={15}/></button>)}</section>
   <section className="rail-manifesto"><Sparkles size={18}/><strong>La calidad importa.</strong><p>No buscamos más publicaciones. Buscamos mejores conversaciones.</p></section>
   <footer className="footer-links">Acerca de · Normas · Privacidad · Términos<br/><span>© 2026 Perspectiva</span></footer>
 </aside>
}

function Avatar({initials}){ return <div className="avatar">{initials}</div> }
function EmptyState(){return <div className="empty"><Search size={28}/><h2>No encontramos conversaciones</h2><p>Prueba con otra búsqueda o explora alguno de los temas.</p></div>}

function MobileMenu({navigate,close}){
 return <div className="mobile-overlay" onClick={close}><div className="mobile-panel" onClick={e=>e.stopPropagation()}><div className="mobile-head"><span className="brand"><span className="brand-mark">P</span>perspectiva</span><button className="icon-btn" onClick={close}><X/></button></div><NavItem icon={<Home/>} label="Inicio" onClick={()=>navigate("home")}/><NavItem icon={<TrendingUp/>} label="En tendencia" onClick={()=>navigate("trending")}/><NavItem icon={<Bookmark/>} label="Guardados" onClick={()=>navigate("saved")}/><div className="mobile-divider"/><div className="side-title">Explorar</div>{categories.map(c=><button className="category-link" key={c.id} onClick={()=>navigate("category",c.id)}><span>{c.icon}</span>{c.name}</button>)}</div></div>
}

function Compose({onClose,onPublish}){
 const [title,setTitle]=useState(""); const [excerpt,setExcerpt]=useState(""); const [cat,setCat]=useState("actualidad"); const [tags,setTags]=useState("");
 return <div className="modal-overlay"><div className="compose-modal"><div className="compose-head"><div><span className="kicker">NUEVA CONVERSACIÓN</span><h2>¿Qué quieres poner sobre la mesa?</h2></div><button className="icon-btn" onClick={onClose}><X/></button></div>
   <label>Título<input autoFocus value={title} onChange={e=>setTitle(e.target.value)} placeholder="Haz que la pregunta invite a pensar..."/></label>
   <label>Tu perspectiva<textarea value={excerpt} onChange={e=>setExcerpt(e.target.value)} placeholder="Explica la idea, comparte contexto o formula una pregunta..."/></label>
   <div className="form-row"><label>Tema<select value={cat} onChange={e=>setCat(e.target.value)}>{categories.map(c=><option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}</select></label><label>Etiquetas<input value={tags} onChange={e=>setTags(e.target.value)} placeholder="IA, futuro, educación"/></label></div>
   <div className="compose-footer"><span>Las mejores conversaciones aportan contexto y respetan perspectivas diferentes.</span><button className="primary-btn" disabled={!title.trim()||!excerpt.trim()} onClick={()=>onPublish({category:cat,title,excerpt,tags:tags.split(",").map(t=>t.trim()).filter(Boolean)})}><Send size={16}/> Publicar</button></div>
 </div></div>
}

createRoot(document.getElementById("root")).render(<App/>);