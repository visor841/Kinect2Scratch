(function(ext) {
    
    //The variable that will hold the json to be read from
    var jsonObject = null;
    
    //The scale applied to the kinect data to make it map to the canvas better.
    var xScale = 280;
    var yScale = 210;
    var zScale = 200;
    
    //The status of the kinect
    var status = 0;
    
    //alert letting the user know what needs to be done before loading the extension.
    alert("BEFORE CLICKING OK: Make sure the kinect is connected and your JSON websocket server has started");
     
    console.log("connecting to server ..");

    // create a new websocket and connect
    window.ws = new WebSocket('ws://localhost:8181/');
    
    // when data is comming from the server, this method is called
    ws.onmessage = function (evt) {
        jsonObject = JSON.parse(evt.data);
            if(jsonObject.bodies == '')
            {
                status = 1;
            } else
            {
                status = 2;
            }
    };

    // when the connection is established, this method is called
    ws.onopen = function () {
        console.log('.. connection open');
    };

    // when the connection is closed, this method is called
    ws.onclose = function () {
        console.log('.. connection closed');
        status = 0;
    };

    // Cleanup function when the extension is unloaded
    ext._shutdown = function()
    {
    window.ws.close();
    };
    

    // Reports status of kinect
    ext._getStatus = function() {
        if(status == 0)
        {
        return {status: 0, msg: 'Kinect is not connected to Scratch'};
        }
        if(status == 1)
        {
            return {status: 1, msg: 'Kinect is connected, but is not detecting any bodies'};
        }
        if(status == 2)
        {
            return {status: 2, msg: 'Kinect is sending body data'};
        }
    };
    
        // Block and block menu descriptions
    var descriptor = {
        blocks: [
            ['r', '%m.b %m.j %m.c', 'joints', 'Body 1', 'Head', 'x'],
            ['r', '%m.b %m.d Handstate', 'handdebug', 'Body 1', 'Left'],
            ['r', '%m.b id', 'bodyid', 'Body 1'],
            ['b', '%m.b %m.d Handstate is %m.h', 'handstate', 'Body 1', 'Left', 'Closed'],
            ['b', '%m.b tracked', 'tracked', 'Body 1'],
            ['b', 'connected', 'connected'],
            ['', 'Basic body check', 'basic_body_check'],
            ['', 'restart local connection', 'restart'],
            ['', 'Create connection to %s', 'ipconnect', '0.0.0.0'],
            ['', 'Close connection', 'closeconn'],
            ['', 'console.log %n', 'write'],
            ['', 'bad only %n', 'writeB']
        ],
        
        menus: {
	    j: ['Left Ankle', 'Right Ankle', 'Left Elbow', 'Right Elbow', 'Left Foot', 'Right Foot', 'Left Hand', 'Right Hand', 'Left Hand Tip', 'Right Hand Tip', 'Head', 'Left Hip', 'Right Hip', 'Left Knee', 'Right Knee', 'Neck', 'Left Shoulder', 'Right Shoulder', 'Spine Base', 'Spine Middle', 'Spine Shoulder', 'Left Thumb', 'Right Thumb', 'Left Wrist', 'Right Wrist'],
        b: ['Body 1', 'Body 2', 'Body 3', 'Body 4', 'Body 5', 'Body 6'],
        h: ['Unknown', 'Not Tracked', 'Open', 'Closed', 'Lasso'],
        c: ['x', 'y', 'z'],
        d: ['Left', 'Right']
    }
    };
    
    //restarts the local connection
    ext.restart = function() {
        window.ws.close();
        console.log("connecting to local server ..");
        window.ws = new WebSocket('ws://localhost:8181/');
        
        // when data is comming from the server, this method is called
        ws.onmessage = function (evt) {
            jsonObject = JSON.parse(evt.data);
            if(jsonObject.bodies == '')
            {
                status = 1;
            } else
            {
                status = 2;
            }
    };

    // when the connection is established, this method is called
    ws.onopen = function () {
        console.log('.. connection open');
    };

    // when the connection is closed, this method is called
    ws.onclose = function () {
        console.log('.. connection closed');
        status = 0;
    };
    };
    
    //s: a string containing the ip the user wishes to connect to.
    //Creates a remote connection to s.
    ext.ipconnect = function(s) {
        window.ws.close();
        console.log("connecting to "+s+' ..');
        window.ws = new WebSocket('ws://'+s+':8181/');
        
        // when data is comming from the server, this method is called
        ws.onmessage = function (evt) {
            jsonObject = JSON.parse(evt.data);
            if(jsonObject.bodies == '')
            {
                status = 1;
            } else
            {
                status = 2;
            }
    };

    // when the connection is established, this method is called
    ws.onopen = function () {
        console.log('.. connection open');
    };

    // when the connection is closed, this method is called
    ws.onclose = function () {
        console.log('.. connection closed');
        status = 0;
    };
    }
    
    //Closes the current connection
    ext.closeconn = function()
    {
        window.ws.close();
    }
    
    //m: the number to be written to the console
    //Outputs numeric content to console
    ext.write = function(m){
        console.log(m);
    };
    
    //m: input to be compared to 0
    //Writes "bad" in console if the input is 0
    ext.writeB = function(m){
        if(m == 0)
        {
            console.log("bad");
        }
    };
    
    //Checks the body 1 head x coordinate
    //Good for check if any data is getting in from the kinect
    ext.basic_body_check = function() {
        console.log(jsonObject.bodies[0].joints[3].x*xScale);
    };
    
    
    //m: the body chosen (Body 1-6)
    //Gives the id of the selected body
    ext.bodyid = function(m)
    {
        switch(m){
            case 'Body 1': return jsonObject.bodies[0].id;
            case 'Body 2': return jsonObject.bodies[1].id;
            case 'Body 3': return jsonObject.bodies[2].id;
            case 'Body 4': return jsonObject.bodies[3].id;
            case 'Body 5': return jsonObject.bodies[4].id;
            case 'Body 6': return jsonObject.bodies[5].id;
        }
    }
    
        //True if scratch is receiving the kinect (but not necessarily data)
    ext.connected = function()
    {
        if(status == 0){
            return false;
        }
        
        if(status == 1 || 2){
            return true;
        }
    };
    
    //m: the body chosen (Body 1-6)
    //True if scratch is receiving the chosen body data
    ext.tracked = function(m)
    {
        var i = -1;
        switch(m){
            case 'Body 1': i = 0;
                break;
            case 'Body 2': i = 1;
                break;
            case 'Body 3': i = 2;
                break;
            case 'Body 4': i = 3;
                break;
            case 'Body 5': i = 4;
                break;
            case 'Body 6': i = 5;
                break;
        }
        
        return jsonObject.bodies[i].id != 0;
    };
    
    
    //l: the body chosen (Body 1-6)
    //d: which handstate (left or right)
    //Outputs the left handstate of the selected body
    ext.handdebug = function(l,d)
    {
        var i;
        switch(l){
            case 'Body 1': i=0;
                break;
            case 'Body 2': i=1;
                break;
            case 'Body 3': i=2;
                break;
            case 'Body 4': i=3;
                break;
            case 'Body 5': i=4;
                break;
            case 'Body 6': i=5;
                break;
        }
        
        switch(d)
        {
            case 'Left': return jsonObject.bodies[i].lhandstate;
            case 'Right': return jsonObject.bodies[i].rhandstate;
        }
    }
    
    //l: The selected body (Body 1-6)
    //d: Which handstate (left or right)
    //n: The selected handstate (Unknown, Not Tracked, Open, Closed, Lasso)
    //Returns true if the selected bodies left handstate is the same as block selected one.
    ext.handstate = function(l,d,n)
    {
        var i;
        var j;
        switch(l){
            case 'Body 1': i=0;
                break;
            case 'Body 2': i=1;
                break;
            case 'Body 3': i=2;
                break;
            case 'Body 4': i=3;
                break;
            case 'Body 5': i=4;
                break;
            case 'Body 6': i=5;
                break;
        }
        
        switch(n)
        {
            case 'Unknown': j = 0;
                break;
            case 'Not Tracked': j = 1;
                break;
            case 'Open': j = 2;
                break;
            case 'Closed': j = 3;
                break;
            case 'Lasso': j = 4;
                break;
        }
        
        switch(d)
        {
            case 'Left': return jsonObject.bodies[i].lhandstate == j;
            case 'Right': return jsonObject.bodies[i].rhandstate == j;
        }
    }
    
        
    //l: The body chosen (Body 1-6).
    //k1: The joint chosen (All joint the kinect v2 tracks).
    //x: The chosen coordinate (x, y, or z).
    //Gets the coordinate chosen from the joint chosen from the body chosen
    ext.joints = function(l,k1,x)
    {
        var a;
        var b;
        switch(k1){
            case 'Left Ankle': a=14;
                break;
            case 'Right Ankle': a=18;
                break;
            case 'Left Elbow': a=5;
                break;
            case 'Right Elbow': a=9;
                break;
            case 'Left Foot': a=15;
                break;
            case 'Right Foot': a=19;
                break;
            case 'Left Hand': a=7;
                break;
            case 'Right Hand': a=11;
                break;
            case 'Left Hand Tip': a=21;
                break;
            case 'Right Hand Tip': a=23;
                break;
            case 'Head': a=3;
                break;
            case 'Left Hip': a=12;
                break;
            case 'Right Hip': a=16;
                break;
            case 'Left Knee': a=13;
                break;
            case 'Right Knee': a=17;
                break;
            case 'Neck': a=2;
                break;
            case 'Left Shoulder': a=4;
                break;
            case 'Right Shoulder': a=8;
                break;
            case 'Spine Base': a=0;
                break;
            case 'Spine Middle': a=1;
                break;
            case 'Spine Shoulder': a=20;
                break;
            case 'Left Thumb': a=22;
                break;
            case 'Right Thumb': a=24;
                break;
            case 'Left Wrist': a=6;
                break;
            case 'Right Wrist': a=10;
                break;
        }
        
        switch(l){
            case 'Body 1': b=0;
                break;
            case 'Body 2': b=1;
                break;
            case 'Body 3': b=2;
                break;
            case 'Body 4': b=3;
                break;
            case 'Body 5': b=4;
                break;
            case 'Body 6': b=5;
                break;
        }
        
        switch(x){
            case 'x': return jsonObject.bodies[b].joints[a].x*xScale;
            case 'y': return jsonObject.bodies[b].joints[a].y*yScale;
            case 'z': return jsonObject.bodies[b].joints[a].z*zScale;
        }
    }
        
    // Register the extension
    ScratchExtensions.register('SkelScratch', descriptor, ext);
})({});