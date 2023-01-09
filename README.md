# Klue

[![Klue](https://i.imgur.com/d9JHEc8.png "Klue Interface - A tool to remember the Kanji")](https://klue.vercel.app/)

Klue is a website to help you remember the Kanji. It's based off of the 6th edition of [Remembering the Kanji by James W. Heisig](https://www.amazon.com/Remembering-Kanji-Complete-Japanese-Characters/dp/0824835921).

Klue is a website that converts a dataset into flashcards. It is intentionally your job to fill in the information for each card you learn along the way.

## Getting Started

The website will first ask you for a character set. You can find the ordered character set for Remembering the Kanji [here](https://gist.github.com/llGaetanll/b7ce3ef325e6c6da0f3e45d66fd5d7c9).

1. Save the contents of the gist as a json file
2. Upload the file to the website

## Keyboard Shortcuts

To make it as fast as possible to input data about the kanji, you can use the following shortcuts

- `1` mark card as easy
- `2` mark card as medium
- `3` mark card as hard
- `right` move to the next kanji
    
    Note: there is a known issue in which the user is able to move forward in testing mode without rating the card. I'll fix this soon but in the mean time, avoid pressing this when testing
- `left` (only in edit mode) go back to the previous kanji
- `space` toggle the definition and notes associated with the kanji
- `e` Enter edit mode
- `esc` Exit edit/definition mode
