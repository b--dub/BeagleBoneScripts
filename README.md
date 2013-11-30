BeagleBoneScripts
=================

This repo will house the JavaSript apps I am writing for the BeagleBone Black with the BoneScript API.  This repo is the counterpart to the /b--dub/BBBweb repo which houses the HTML portion of the overall package.  The complete structure represents a three part coordination between a Lighttpd server hosting HTML, a node.js WebSocket server (located in the autorun directory of this repo) acting as a middle-man between the scripts and the web pages that call them (the user interfaces), and an instance of node as an interpreter for the server-side scripts.  My original intention was to write the scripts to be completely self sufficient, and so the separate repos made more sense, but it is looking like I may be dropping that concept and designing each script to specifically interact with an HTML document as its UI.


See the /b--dub/BBBweb repo README for more information.

