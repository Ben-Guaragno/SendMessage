# SendMessage
Send Message app for Fitbit Versa and Ionic

This is a fork of @PeterSumm's original SendMessage app. This version adds the ability to include location data (and other relevant location information) in the web requests. A blast mode has also been added, which allows identical requests to be sent to multiple URLs with one tap. I also made some minor changes to the fetch request setup, which results in more consistent and understandable outputs to the user.

All credit for the original idea and implementation goes to @PeterSumm, I just added some small extra features I thought were missing.
This modified version of @PeterSumm's app is also not available on the FitBit appstore, it is purely for developmental purposes. His app's page is linked below.

See a copy of @PeterSumm's instructions below, or at his GitHub repo for this project.

###Original README

This is a port of my Send Message app from Pebble - an HTTPS client supporting GET and POST requests (though HTTP only works to IP addresses on your own network).  It is intended for technically proficient audience and use of its more advanced features requires some understanding of JSON data structures.

The app allows configuration with three sets of label, URL, data segment (for POST) and headers.  Touching that label will then fire off the associated request, and the status text returned will be displayed on the watch and can be dismissed by touching it.

For example, the label might be 'Send help!' and the URL/data fields contain the request details to send this message to a service that creates a text message (to which you would need to subscribe).  The URL will be something like 'https://server.domain.com/path' and the data might look something like {"{'key':'message','value':'Help!'} "} or {"{'key':'message','value':'~Lbl'} "} (where ~Lbl is substitited with the label text).

To test your requests, you might want to use the free testing service at https://www.requestcatcher.com.

The compiled version of this app is at https://gam.fitbit.com/gallery/app/08e2723d-c0f3-429c-9cb8-e93086fd604c.

The Pebble version of this app could also substitute location-specific information.  I may implement this later if there's enough interest.
