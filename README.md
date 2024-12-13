# crlp README

This is the README for the demo of extension for "l4" for legislative drafting.

## First, how do I run it

`npm run build`
`vcse package`

It'll ask you if there's a license, should we go on? No there is no license right now, go ahead and click 'y'.

A file will come out. This file is called: *crlp-0.0.1.vsix*. You can then *Install from VSIX* from your VSCode, or online VSCode.dev. It'll install. Now it looks like nothing is happening but that's because you must write a rule.

## Further explanations:

## Ladder Diagram

At the moment it displays a ladder diagram or a set of rules written in L4.
The ladder diagram is an npm library, from previous work by Jules and Zeming and (can be found here)[https://github.com/smucclaw/ladder-diagram]. For this extension it has been bundled by esbuild. If there are any further updates to the library this can be done like this:

`npx esbuild node_modules/ladder-diagram/js/ladder.js --bundle --format=iife --global-name=LadderDiagram --outfile=media/ladder-diagram.min.js`

...and you will see this bundled ladder-diagram.min.js in media. Attempting to import it directly into the extension causes some issues as this is an es6 module.

## L4 code it accepts

In this demo not every single L4 rule can be parsed. The recommended format is this:

`EVERY Person
WHO walks
AND eats
OR drinks
MUST sing`

This demo file is found in the repo under examples/test.l4.

In the future the rules will be sensibly parsed by a backend.

However for now, it takes variations of this very specific rule. You can change the subject, and the verbs. Do not be alarmed if your L4 rule produces an error (Invalid rule format)! Trust that your format is theoretically valid L4. Return to this rule, the only rule for now. The rule must go: Every noun WHO verb1 AND verb2 MUST verb3. I apologise. At the moment it uses a hacky typescript parse that parses only this type of rule.

## How To Get The Diagram To Appear On The Right

So you have now pasted in this rule. There is no diagram. How does it appear?

1) You can save the file.

2) Assuming you don't want to, there is a very small button that says Update Diagram in the status bar on the bottom right. It's to the left of the notification bell, maybe beside Prettier, or what have you. If you click it, the picture appears! If you modify it, it appears in a new panel.

---

## Thanks!

---

## Known Issues

Known Issues have been described above. This is a demo.

## Release Notes

### 1.0.0

Initial release of a demo.