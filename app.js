var express    			= require("express");
var mongoose    		= require("mongoose");
var bodyParser  		= require("body-parser"); 
var methodOverride 		= require("method-override");
var expressSanitizer 	= require("express-sanitizer");
var app         		= express();
var port        		= 3000 || process.env.PORT;

mongoose.connect("mongodb://localhost/restful_blog_app");
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

// * Blog Schema
var blogSchema = new mongoose.Schema({
	title:  	String,
	image:  	String,
	body:      	String,
	created:    {type: Date, default: Date.now},
})

var Blog = mongoose.model("Blog", blogSchema);

// * RESTful Routes

app.get("/", function(req, res){
	res.redirect("/blogs")
})

// ? Index Route
app.get("/blogs", function(req, res){
	Blog.find({}, function(err, blogs) {
		if(err){
			console.log("Error!");
		} else {
			res.render("index", {blogs: blogs});
		}
	})
});

// ? New Route
app.get("/blogs/new", function(req, res){
	res.render("new")
});

// ? Create Route
app.post("/blogs", function(req, res) {
	
	// Create Blog
	console.log(req.body);
	// ! Sanitize code
	req.body.blog.body = req.sanitize(req.body.blog.body);
	console.log(req.body);
	Blog.create(req.body.blog, function(err, newBlog) {
		if(err) {
			res.render("new");
		} else {
			// Redirect to Index
			res.redirect("/blogs");  
		}
	});
})

// ? Show Route
app.get("/blogs/:id", function(req, res) {
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err) {
			res.redirect("/blogs");
		} else {
			res.render("show", {blog: foundBlog});
		}
	});
}); 

// ? Edit Routes
app.get("/blogs/:id/edit", function(req, res) {
	Blog.findById(req.params.id, function(err, foundBlog) {
		if(err) {
			res.redirect("/blogs");
		} else {
			res.render("edit", {blog: foundBlog});
		}
	});
})

// ? Update Routes
app.put("/blogs/:id", function(req, res) {
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate (req.params.id, req.body.blog, function(err, updatedBlog) {
		if(err) {
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs/" + req.params.id)
		}
	});
});

// ? Delete Route
app.delete("/blogs/:id", function(req, res) {
	// Destroy Blog
	Blog.findByIdAndRemove(req.params.id, function(err) {
		if(err) {
			res.redirect("/blogs");
		}
		else {
			res.redirect("/blogs");
		}
	});
});

// ? Establish Connection
app.listen(port, function() {
	console.log("Connected!");
})