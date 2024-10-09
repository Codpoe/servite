import{j as e}from"./jsx-runtime-OjB1YB6s.js";import{u as l}from"./index-Crl2ozBJ.js";const n="/servite/_build/assets/photo-BMXB-TGS.avif",r={commitTime:1728479174,some:"info"},h=[{id:"sample-from-tailwind",text:"Sample from tailwind",depth:1},{id:"what-to-expect-from-here-on-out",text:"What to expect from here on out",depth:2},{id:"typography-should-be-easy",text:"Typography should be easy",depth:3},{id:"what-if-we-stack-headings",text:"What if we stack headings?",depth:2},{id:"we-should-make-sure-that-looks-good-too",text:"We should make sure that looks good, too.",depth:3},{id:"when-a-heading-comes-after-a-paragraph-",text:"When a heading comes after a paragraph …",depth:3},{id:"code-should-look-okay-by-default",text:"Code should look okay by default.",depth:2},{id:"what-about-nested-lists",text:"What about nested lists?",depth:3},{id:"there-are-other-elements-we-need-to-style",text:"There are other elements we need to style",depth:2},{id:"sometimes-i-even-use-code-in-headings",text:"Sometimes I even use code in headings",depth:3},{id:"we-havent-used-an-h4-yet",text:"We haven't used an h4 yet",depth:4},{id:"we-still-need-to-think-about-stacked-headings-though",text:"We still need to think about stacked headings though.",depth:3},{id:"lets-make-sure-we-dont-screw-that-up-with-h4-elements-either",text:"Let's make sure we don't screw that up with h4 elements, either.",depth:4}];function i(t){const s={a:"a",blockquote:"blockquote",code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",h4:"h4",hr:"hr",img:"img",li:"li",ol:"ol",p:"p",pre:"pre",span:"span",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...l(),...t.components};return e.jsxs(e.Fragment,{children:[e.jsx(s.h1,{id:"sample-from-tailwind",children:"Sample from tailwind"}),`
`,e.jsx("p",{className:"lead",children:`Until now, trying to style an article, document, or blog post with Tailwind
has been a tedious task that required a keen eye for typography and a lot of
complex custom CSS.`}),`
`,e.jsx(s.p,{children:"local image"}),`
`,e.jsx("img",{src:n}),`
`,e.jsx(s.p,{children:e.jsx(s.img,{src:n,alt:"local img",title:"title"})}),`
`,e.jsx(s.hr,{}),`
`,e.jsx("img",{src:n,width:"200"}),`
`,e.jsx(s.hr,{}),`
`,e.jsxs(s.p,{children:["By default, Tailwind removes all of the default browser styling from paragraphs, headings, lists and more. This ends up being really useful for building application UIs because you spend less time undoing user-agent styles, but when you ",e.jsx(s.em,{children:"really are"})," just trying to style some content that came from a rich-text editor in a CMS or a markdown file, it can be surprising and unintuitive."]}),`
`,e.jsx(s.p,{children:"We get lots of complaints about it actually, with people regularly asking us things like:"}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsxs(s.p,{children:["Why is Tailwind removing the default styles on my ",e.jsx(s.code,{children:"h1"})," elements? How do I disable this? What do you mean I lose all the other base styles too?"]}),`
`]}),`
`,e.jsxs(s.p,{children:["We hear you, but we're not convinced that simply disabling our base styles is what you really want. You don't want to have to remove annoying margins every time you use a ",e.jsx(s.code,{children:"p"})," element in a piece of your dashboard UI. And I doubt you really want your blog posts to use the user-agent styles either — you want them to look ",e.jsx(s.em,{children:"awesome"}),", not awful."]}),`
`,e.jsxs(s.p,{children:["The ",e.jsx(s.code,{children:"@tailwindcss/typography"})," plugin is our attempt to give you what you ",e.jsx(s.em,{children:"actually"})," want, without any of the downsides of doing something stupid like disabling our base styles."]}),`
`,e.jsxs(s.p,{children:["It adds a new ",e.jsx(s.code,{children:"prose"})," class that you can slap on any block of vanilla HTML content and turn it into a beautiful, well-formatted document:"]}),`
`,e.jsx(s.pre,{className:"shiki shiki-themes min-light plastic",style:{backgroundColor:"#ffffff","--shiki-dark-bg":"#21252B",color:"#24292eff","--shiki-dark":"#A9B2C3"},tabIndex:"0",children:e.jsxs(s.code,{children:[e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"<"}),e.jsx(s.span,{style:{color:"#22863A","--shiki-dark":"#E5C07B"},children:"article"}),e.jsx(s.span,{style:{color:"#6F42C1","--shiki-dark":"#D19A66"},children:" class"}),e.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#A9B2C3"},children:"="}),e.jsx(s.span,{style:{color:"#22863A","--shiki-dark":"#A9B2C3"},children:'"'}),e.jsx(s.span,{style:{color:"#22863A","--shiki-dark":"#98C379"},children:"prose"}),e.jsx(s.span,{style:{color:"#22863A","--shiki-dark":"#A9B2C3"},children:'"'}),e.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:">"})]}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"  <"}),e.jsx(s.span,{style:{color:"#22863A","--shiki-dark":"#E5C07B"},children:"h1"}),e.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:">Garlic bread with cheese: What the science tells us</"}),e.jsx(s.span,{style:{color:"#22863A","--shiki-dark":"#E5C07B"},children:"h1"}),e.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:">"})]}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"  <"}),e.jsx(s.span,{style:{color:"#22863A","--shiki-dark":"#E5C07B"},children:"p"}),e.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:">"})]}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"    For years parents have espoused the health benefits of eating garlic bread"})}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"    with cheese to their children, with the food earning such an iconic status"})}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"    in our culture that kids will often dress up as warm, cheesy loaf for"})}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"    Halloween."})}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"  </"}),e.jsx(s.span,{style:{color:"#22863A","--shiki-dark":"#E5C07B"},children:"p"}),e.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:">"})]}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"  <"}),e.jsx(s.span,{style:{color:"#22863A","--shiki-dark":"#E5C07B"},children:"p"}),e.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:">"})]}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"    But a recent study shows that the celebrated appetizer may be linked to a"})}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"    series of rabies cases springing up around the country."})}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"  </"}),e.jsx(s.span,{style:{color:"#22863A","--shiki-dark":"#E5C07B"},children:"p"}),e.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:">"})]}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#C2C3C5","--shiki-dark":"#5F6672",fontStyle:"inherit","--shiki-dark-font-style":"italic"},children:"  <!-- ... -->"})}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"</"}),e.jsx(s.span,{style:{color:"#22863A","--shiki-dark":"#E5C07B"},children:"article"}),e.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:">"})]})]})}),`
`,e.jsxs(s.p,{children:["For more information about how to use the plugin and the features it includes, ",e.jsx(s.a,{href:"https://github.com/tailwindcss/typography/blob/master/README.md",children:"read the documentation"}),"."]}),`
`,e.jsx(s.hr,{}),`
`,e.jsx(s.h2,{id:"what-to-expect-from-here-on-out",children:"What to expect from here on out"}),`
`,e.jsxs(s.p,{children:["What follows from here is just a bunch of absolute nonsense I've written to dogfood the plugin itself. It includes every sensible typographic element I could think of, like ",e.jsx(s.strong,{children:"bold text"}),", unordered lists, ordered lists, code blocks, block quotes, ",e.jsx(s.em,{children:"and even italics"}),"."]}),`
`,e.jsx(s.p,{children:"It's important to cover all of these use cases for a few reasons:"}),`
`,e.jsxs(s.ol,{children:[`
`,e.jsx(s.li,{children:"We want everything to look good out of the box."}),`
`,e.jsx(s.li,{children:"Really just the first reason, that's the whole point of the plugin."}),`
`,e.jsx(s.li,{children:"Here's a third pretend reason though a list with three items looks more realistic than a list with two items."}),`
`]}),`
`,e.jsx(s.p,{children:"Now we're going to try out another header style."}),`
`,e.jsx(s.h3,{id:"typography-should-be-easy",children:"Typography should be easy"}),`
`,e.jsx(s.p,{children:"So that's a header for you — with any luck if we've done our job correctly that will look pretty reasonable."}),`
`,e.jsx(s.p,{children:"Something a wise person once told me about typography is:"}),`
`,e.jsxs(s.blockquote,{children:[`
`,e.jsx(s.p,{children:"Typography is pretty important if you don't want your stuff to look like trash. Make it good then it won't be bad."}),`
`]}),`
`,e.jsx(s.p,{children:"It's probably important that images look okay here by default as well:"}),`
`,e.jsxs("figure",{children:[e.jsx("img",{src:"https://images.unsplash.com/photo-1556740758-90de374c12ad?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80",alt:""}),e.jsx("figcaption",{children:e.jsx(s.p,{children:`Contrary to popular belief, Lorem Ipsum is not simply random text. It has
roots in a piece of classical Latin literature from 45 BC, making it over
2000 years old.`})})]}),`
`,e.jsx(s.p,{children:"Now I'm going to show you an example of an unordered list to make sure that looks good, too:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:"So here is the first item in this list."}),`
`,e.jsx(s.li,{children:"In this example we're keeping the items short."}),`
`,e.jsx(s.li,{children:"Later, we'll use longer, more complex list items."}),`
`]}),`
`,e.jsx(s.p,{children:"And that's the end of this section."}),`
`,e.jsx(s.h2,{id:"what-if-we-stack-headings",children:"What if we stack headings?"}),`
`,e.jsx(s.h3,{id:"we-should-make-sure-that-looks-good-too",children:"We should make sure that looks good, too."}),`
`,e.jsx(s.p,{children:"Sometimes you have headings directly underneath each other. In those cases you often have to undo the top margin on the second heading because it usually looks better for the headings to be closer together than a paragraph followed by a heading should be."}),`
`,e.jsx(s.h3,{id:"when-a-heading-comes-after-a-paragraph-",children:"When a heading comes after a paragraph …"}),`
`,e.jsx(s.p,{children:"When a heading comes after a paragraph, we need a bit more space, like I already mentioned above. Now let's see what a more complex list would look like."}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsx(s.p,{children:e.jsx(s.strong,{children:"I often do this thing where list items have headings."})}),`
`,e.jsx(s.p,{children:"For some reason I think this looks cool which is unfortunate because it's pretty annoying to get the styles right."}),`
`,e.jsx(s.p,{children:"I often have two or three paragraphs in these list items, too, so the hard part is getting the spacing between the paragraphs, list item heading, and separate list items to all make sense. Pretty tough honestly, you could make a strong argument that you just shouldn't write this way."}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(s.p,{children:e.jsx(s.strong,{children:"Since this is a list, I need at least two items."})}),`
`,e.jsx(s.p,{children:"I explained what I'm doing already in the previous list item, but a list wouldn't be a list if it only had one item, and we really want this to look realistic. That's why I've added this second list item so I actually have something to look at when writing the styles."}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(s.p,{children:e.jsx(s.strong,{children:"It's not a bad idea to add a third item either."})}),`
`,e.jsx(s.p,{children:"I think it probably would've been fine to just use two items but three is definitely not worse, and since I seem to be having no trouble making up arbitrary things to type, I might as well include it."}),`
`]}),`
`]}),`
`,e.jsx(s.p,{children:"After this sort of list I usually have a closing statement or paragraph, because it kinda looks weird jumping right to a heading."}),`
`,e.jsx(s.h2,{id:"code-should-look-okay-by-default",children:"Code should look okay by default."}),`
`,e.jsxs(s.p,{children:["I think most people are going to use ",e.jsx(s.a,{href:"https://highlightjs.org/",children:"highlight.js"})," or ",e.jsx(s.a,{href:"https://prismjs.com/",children:"Prism"})," or something if they want to style their code blocks but it wouldn't hurt to make them look ",e.jsx(s.em,{children:"okay"})," out of the box, even with no syntax highlighting."]}),`
`,e.jsxs(s.p,{children:["Here's what a default ",e.jsx(s.code,{children:"tailwind.config.js"})," file looks like at the time of writing:"]}),`
`,e.jsx(s.pre,{className:"shiki shiki-themes min-light plastic",style:{backgroundColor:"#ffffff","--shiki-dark-bg":"#21252B",color:"#24292eff","--shiki-dark":"#A9B2C3"},tabIndex:"0",children:e.jsxs(s.code,{children:[e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#1976D2","--shiki-dark":"#E5C07B"},children:"module"}),e.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"."}),e.jsx(s.span,{style:{color:"#1976D2","--shiki-dark":"#E5C07B"},children:"exports"}),e.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#E06C75"},children:" ="}),e.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:" {"})]}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"  purge"}),e.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#A9B2C3"},children:":"}),e.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:" []"}),e.jsx(s.span,{style:{color:"#212121","--shiki-dark":"#A9B2C3"},children:","})]}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"  theme"}),e.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#A9B2C3"},children:":"}),e.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:" {"})]}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"    extend"}),e.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#A9B2C3"},children:":"}),e.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:" {}"}),e.jsx(s.span,{style:{color:"#212121","--shiki-dark":"#A9B2C3"},children:","})]}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"  }"}),e.jsx(s.span,{style:{color:"#212121","--shiki-dark":"#A9B2C3"},children:","})]}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"  variants"}),e.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#A9B2C3"},children:":"}),e.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:" {}"}),e.jsx(s.span,{style:{color:"#212121","--shiki-dark":"#A9B2C3"},children:","})]}),`
`,e.jsxs(s.span,{className:"line",children:[e.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"  plugins"}),e.jsx(s.span,{style:{color:"#D32F2F","--shiki-dark":"#A9B2C3"},children:":"}),e.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:" []"}),e.jsx(s.span,{style:{color:"#212121","--shiki-dark":"#A9B2C3"},children:","})]}),`
`,e.jsx(s.span,{className:"line",children:e.jsx(s.span,{style:{color:"#24292EFF","--shiki-dark":"#A9B2C3"},children:"};"})})]})}),`
`,e.jsx(s.p,{children:"Hopefully that looks good enough to you."}),`
`,e.jsx(s.h3,{id:"what-about-nested-lists",children:"What about nested lists?"}),`
`,e.jsx(s.p,{children:"Nested lists basically always look bad which is why editors like Medium don't even let you do it, but I guess since some of you goofballs are going to do it we have to carry the burden of at least making it work."}),`
`,e.jsxs(s.ol,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Nested lists are rarely a good idea."}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:'You might feel like you are being really "organized" or something but you are just creating a gross shape on the screen that is hard to read.'}),`
`,e.jsx(s.li,{children:"Nested navigation in UIs is a bad idea too, keep things as flat as possible."}),`
`,e.jsx(s.li,{children:"Nesting tons of folders in your source code is also not helpful."}),`
`]}),`
`]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Since we need to have more items, here's another one."}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:"I'm not sure if we'll bother styling more than two levels deep."}),`
`,e.jsx(s.li,{children:"Two is already too much, three is guaranteed to be a bad idea."}),`
`,e.jsx(s.li,{children:"If you nest four levels deep you belong in prison."}),`
`]}),`
`]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Two items isn't really a list, three is good though."}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:"Again please don't nest lists if you want people to actually read your content."}),`
`,e.jsx(s.li,{children:"Nobody wants to look at this."}),`
`,e.jsx(s.li,{children:"I'm upset that we even have to bother styling this."}),`
`]}),`
`]}),`
`]}),`
`,e.jsxs(s.p,{children:["The most annoying thing about lists in Markdown is that ",e.jsx(s.code,{children:"<li>"})," elements aren't given a child ",e.jsx(s.code,{children:"<p>"})," tag unless there are multiple paragraphs in the list item. That means I have to worry about styling that annoying situation too."]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsx(s.p,{children:e.jsx(s.strong,{children:"For example, here's another nested list."})}),`
`,e.jsx(s.p,{children:"But this time with a second paragraph."}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:["These list items won't have ",e.jsx(s.code,{children:"<p>"})," tags"]}),`
`,e.jsx(s.li,{children:"Because they are only one line each"}),`
`]}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(s.p,{children:e.jsx(s.strong,{children:"But in this second top-level list item, they will."})}),`
`,e.jsx(s.p,{children:"This is especially annoying because of the spacing on this paragraph."}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[`
`,e.jsxs(s.p,{children:["As you can see here, because I've added a second line, this list item now has a ",e.jsx(s.code,{children:"<p>"})," tag."]}),`
`,e.jsx(s.p,{children:"This is the second line I'm talking about by the way."}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(s.p,{children:"Finally here's another list item so it's more like a list."}),`
`]}),`
`]}),`
`]}),`
`,e.jsxs(s.li,{children:[`
`,e.jsx(s.p,{children:"A closing list item, but with no nested list, because why not?"}),`
`]}),`
`]}),`
`,e.jsx(s.p,{children:"And finally a sentence to close off this section."}),`
`,e.jsx(s.h2,{id:"there-are-other-elements-we-need-to-style",children:"There are other elements we need to style"}),`
`,e.jsxs(s.p,{children:["I almost forgot to mention links, like ",e.jsx(s.a,{href:"https://tailwindcss.com",children:"this link to the Tailwind CSS website"}),". We almost made them blue but that's so yesterday, so we went with dark gray, feels edgier."]}),`
`,e.jsx(s.p,{children:"We even included table styles, check it out:"}),`
`,e.jsxs(s.table,{children:[e.jsx(s.thead,{children:e.jsxs(s.tr,{children:[e.jsx(s.th,{children:"Wrestler"}),e.jsx(s.th,{children:"Origin"}),e.jsx(s.th,{children:"Finisher"})]})}),e.jsxs(s.tbody,{children:[e.jsxs(s.tr,{children:[e.jsx(s.td,{children:'Bret "The Hitman" Hart'}),e.jsx(s.td,{children:"Calgary, AB"}),e.jsx(s.td,{children:"Sharpshooter"})]}),e.jsxs(s.tr,{children:[e.jsx(s.td,{children:"Stone Cold Steve Austin"}),e.jsx(s.td,{children:"Austin, TX"}),e.jsx(s.td,{children:"Stone Cold Stunner"})]}),e.jsxs(s.tr,{children:[e.jsx(s.td,{children:"Randy Savage"}),e.jsx(s.td,{children:"Sarasota, FL"}),e.jsx(s.td,{children:"Elbow Drop"})]}),e.jsxs(s.tr,{children:[e.jsx(s.td,{children:"Vader"}),e.jsx(s.td,{children:"Boulder, CO"}),e.jsx(s.td,{children:"Vader Bomb"})]}),e.jsxs(s.tr,{children:[e.jsx(s.td,{children:"Razor Ramon"}),e.jsx(s.td,{children:"Chuluota, FL"}),e.jsx(s.td,{children:"Razor's Edge"})]})]})]}),`
`,e.jsxs(s.p,{children:["We also need to make sure inline code looks good, like if I wanted to talk about ",e.jsx(s.code,{children:"<span>"})," elements or tell you the good news about ",e.jsx(s.code,{children:"@tailwindcss/typography"}),"."]}),`
`,e.jsxs(s.h3,{id:"sometimes-i-even-use-code-in-headings",children:["Sometimes I even use ",e.jsx(s.code,{children:"code"})," in headings"]}),`
`,e.jsxs(s.p,{children:["Even though it's probably a bad idea, and historically I've had a hard time making it look good. This ",e.jsx(s.em,{children:'"wrap the code blocks in backticks"'})," trick works pretty well though really."]}),`
`,e.jsxs(s.p,{children:["Another thing I've done in the past is put a ",e.jsx(s.code,{children:"code"})," tag inside of a link, like if I wanted to tell you about the ",e.jsx(s.a,{href:"https://github.com/tailwindcss/docs",children:e.jsx(s.code,{children:"tailwindcss/docs"})})," repository. I don't love that there is an underline below the backticks but it is absolutely not worth the madness it would require to avoid it."]}),`
`,e.jsxs(s.h4,{id:"we-havent-used-an-h4-yet",children:["We haven't used an ",e.jsx(s.code,{children:"h4"})," yet"]}),`
`,e.jsxs(s.p,{children:["But now we have. Please don't use ",e.jsx(s.code,{children:"h5"})," or ",e.jsx(s.code,{children:"h6"})," in your content, Medium only supports two heading levels for a reason, you animals. I honestly considered using a ",e.jsx(s.code,{children:"before"})," pseudo-element to scream at you if you use an ",e.jsx(s.code,{children:"h5"})," or ",e.jsx(s.code,{children:"h6"}),"."]}),`
`,e.jsxs(s.p,{children:["We don't style them at all out of the box because ",e.jsx(s.code,{children:"h4"})," elements are already so small that they are the same size as the body copy. What are we supposed to do with an ",e.jsx(s.code,{children:"h5"}),", make it ",e.jsx(s.em,{children:"smaller"})," than the body copy? No thanks."]}),`
`,e.jsx(s.h3,{id:"we-still-need-to-think-about-stacked-headings-though",children:"We still need to think about stacked headings though."}),`
`,e.jsxs(s.h4,{id:"lets-make-sure-we-dont-screw-that-up-with-h4-elements-either",children:["Let's make sure we don't screw that up with ",e.jsx(s.code,{children:"h4"})," elements, either."]}),`
`,e.jsx(s.p,{children:"Phew, with any luck we have styled the headings above this text and they look pretty good."}),`
`,e.jsx(s.p,{children:"Let's add a closing paragraph here so things end with a decently sized block of text. I can't explain why I want things to end that way but I have to assume it's because I think things will look weird or unbalanced if there is a heading too close to the end of the document."}),`
`,e.jsx(s.p,{children:"What I've written here is probably long enough, but adding this final sentence can't hurt."})]})}function d(t={}){const{wrapper:s}={...l(),...t.components};return s?e.jsx(s,{...t,children:e.jsx(i,{...t})}):i(t)}export{d as default,r as frontmatter,h as toc};
