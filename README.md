# Imgset.js

Javascript image loading based on element width. 

#### Syntax

Note: alt, and focus are not currently implemented.

<pre>
// HTML
&lt;span class="Imgset"&gt;
  &lt;noscript 
    data-json='{
      "set": {
        "0": "photo-500.jpg",
        "768": "photo-1000.jpg",
        "1024": "photo-1400.jpg"
      },
      "alt": "Alternate text.",
      "focus": ["x", "y"]
    }'
  &gt;
    &lt;img src="photo-1000.jpg" alt="Alternate Text." /&gt;
  &lt;/noscript&gt;
&lt;/span&gt;
</pre>

In most of my implementations I know the image width and height and inline padding bottom (height / width \* 100%) to preserve the image ratio. 

<pre>
&lt;span class="Imgset" style="padding-bottom: 66.66%;"&gt;
  ...
&lt;/span&gt;
</pre>

<pre>
&lt;span class="Imgset"&gt;
  // Elements created by Imgset.js:
  &lt;div class="Imgset__background" background-image="{ img_source }" /&gt;
  &lt;img class="Imgset__img" src="{ img_source }" /&gt;
  &lt;noscript 
    data-json='{...}'
  &gt;
    &lt;img src="photo-1000.jpg" alt="Alternate Text." /&gt;
  &lt;/noscript&gt;
&lt;/span&gt;
</pre>

Do some scripts

<pre>
// JS
import Imgset

Imgset()
// or
Imgset('.mySelector')
</pre>
