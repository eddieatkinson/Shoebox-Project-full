## The Shoebox Project
The Shoebox Project is a non-profit company whose purpose is to provide professional photographs and memories for children in the foster care system. We set up a site for the company, including sign-up forms, a blog, login capabilities, an interactive map, and various pages to navigate to on the site.

## Github Link:
[The Shoebox Project GitHub](https://github.com/eddieatkinson/shoebox-project-full)

## Team Members & Roles:
* [Allyson Conrad](https://github.com/allysonc1)
**Scrum Master/Birthday Girl/Developer**
* [Valerie Jane Thoma](https://github.com/ValerieThoma)
**Designer/Class Clown/Developer**
* [Eddie Atkinson](https://github.com/eddieatkinson)
**Data Wrangler/Map Magician/Developer**
* [Amir Patel](https://github.com/Amirpatel89)
**New Kid on the Block/Responsive Developer**


## Technologies used:
**Languages:**
* Node
* JavaScript
* HTML5
* CSS

**Frameworks:**
* Express
* jQuery
* Bootstrap

**Other:**
* MySQL
* Adobe XD - wireframe
* Google Maps API
* County location data from [CivicDashboards](http://catalog.civicdashboards.com)

## Code snippets:
County data displayed when hovered...
``` javascript
function mouseInToRegion(e) {
    // set the hover state so the setStyle function can change the border
    e.feature.setProperty('state', 'hover');
    $('#data-label').css('color', 'black');

    // Get county name from JSON and format it to match data in counties array
    var countyNameFromJson = e.feature.getProperty('name');
    var countyNameAsArray = countyNameFromJson.split(" County");
    var countyNameOnlyArray = countyNameAsArray.splice(0, 1);
    var countyNameOnlyString = countyNameOnlyArray.toString();

    // Search for county and display number of children in foster care
    $('#data-label').text(countyNameOnlyString);
    for(let i = 0; i < counties.length; i++){
        if(counties[i].county == countyNameOnlyString){
            $('#data-value').text(counties[i].childrenInFosterCare);
        }
    }
}
```
...and when searched.
``` javascript
    // Start with statewide data in display
    $('#data-label').html(counties[counties.length - 1].county);
    $('#data-value').html(counties[counties.length - 1].childrenInFosterCare);

    $('#county-search-form').submit(function(event){
        event.preventDefault();
        $('#data-label').css('color', 'black');
        var userSearch = $('#county-input').val();
        var matchFound = false
        // Check for match, ignoring case
        for(let i = 0; i < counties.length; i++){
            if(counties[i].county.toLowerCase() === userSearch.toLowerCase()){
                $('#data-label').html(counties[i].county);
                $('#data-value').html(counties[i].childrenInFosterCare);
                matchFound = true;
                var fullNameOfJsonCounty = counties[i].county + ' County, GA';
            }
        }
        // If no matching counties...
        if(!matchFound){
            $('#data-label').css('color', 'red');
            $('#data-label').html("No counties match your search.");
            $('#data-value').html("");
        }
    });

    // Autocomplete
    // Build array to search
    var countyNames = [];
        for(let i = 0; i < counties.length; i++){
            countyNames.push(counties[i].county);
        }

    // Search to enable automplete
    $( "#county-input" ).autocomplete({
      source: function( request, response ) {
              var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex(request.term), "i");
              response( $.grep( countyNames, function( item ){
                  return matcher.test( item );
              }) );
          }
    });
```

Administrator can upload images directly to Amazon S3 storage and put url into database.
``` javascript
var uploadDir = multer({
    dest: 'public/images'
});

aws.config.loadFromPath('./config/config.json');
aws.config.update({
    signatureVersion: 'v4'
});
var s0 = new aws.S3({});

var upload = multer({
    storage: multerS3({
        s3: s0,
        bucket: 'eddie-first-test-bucket',
        contentType: multerS3.AUTO_CONTENT_TYPE, // Will choose best contentType
        acl: 'public-read',
        metadata: (req, file, cb)=>{
            cb(null, {fieldName: file.fieldname});
        },
        key: (req, file, cb)=>{
            cb(null, Date.now()+file.originalname)
        }
    })
});

// Specify the name of the file input to accept
var nameOfFileField = uploadDir.single('imageToUpload');

var connection = mysql.createConnection(config.db);

router.post('/uploadUserPhotosProcess/:userId/:volId', upload.any(), (req, res)=>{
    var userId = req.params.userId;
    var volId = req.params.volId;
    var info = req.files;
    var insertUrl = `INSERT INTO images (id, url, vol_id) VALUES (?, ?, ?);`;
    info.map((image)=>{
        connection.query(insertUrl, [userId, image.location, volId], (error, results)=>{
            if(error){
                throw error;
            }
        });
    });
    res.redirect(`/volunteers/userReview?msg=${info.length}`);
});
```
## Screenshots:
![Homepage](public/images/screen-shots/mobile-home.jpg)
![Map](public/images/screen-shots/map.png)
![Forms](public/images/screen-shots/volunteer_form.jpg)
Landing page wireframe created in Adobe XD
![Wireframes](public/images/screen-shots/LandingPageWeb1920.png)
Landing page on mobile, desired layout though not fully realized. 
![Wireframes](public/images/screen-shots/iPhone67.png)
![Wireframes](public/images/screen-shots/landing_page_small.png)
Mobile layout still in testing stages

## URL:
[The Shoebox Project](http://myshoeboxproject.org)