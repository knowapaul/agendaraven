# Conventions for AgendaRaven
The conventions for AgendaRaven are listed below.

Follow these to the best of your ability in order 
to write clearer, more efficient code.

# Javasript
## Layout
Major elements should follow this layout format:
1. Imports  
2. Functions that are not exported
3. Exports

Spacing should follow these conventions
- One line space between different elements of the same major element. (e.g. between separate functions or import groups)
- Two line space between major elements (e.g. between imports and functions)

## Comments
Prefer using too many comments to using too few. It is typical to remember less about a project than you think you will.

Include '// TODO:' comments if you ever think of any possible future improvements.

Component exports imported in more than one file should have a documentation comment explaining their function and parameters.

Use the following layout for *Component* comments
(see code for details)

> ## [Function name] Component
> 
> Function description
> 
> @param {Map} props React Props
> - *prop1* = {Type} Description1 (Not Required)
> - prop2 = {Type} Description2
> - prop3 = {Type} Long description example.
> feel free to wrap it by not including the ul item
> to keep the file a manageable length.
> (Use parentheses to supply additional
> information). Avoid [brackets] and {braces}

Use the following layout for *Function* comments

> ## Function name
> @param {Type} Name = Description
> 
> @returns {Type} Description


## Imports
Javascript imports should follow the following format:
- // React Resources (most packages with react in the title)
- // MUI Resources (any MUI packages)
- // Project Resources (any imports from elsewhere in the project)
- // Firebase Resources (any Firebase packages)
- // Other Resources

Make sure to eliminate any unused imports.

Imports from the same parent library should be imported using the curly braces syntax:

> import { alpha, iota, pi } from './GreekLetters';

This method increases readibility, so use it for now. Install a Babel tool to make it more efficient.

If there are no members of a comment header, eliminate the comment header.

# Filesystem
## Format
Group files by their function.

**Notable example: Components**

An element can become a component in one of three ways:

- It is used in more than one file.
- It has a function that may eventually be used in more than one file.
- It cannot be logically grouped with its parent component's file.

## File Naming
File names should begin with a capital letter and have another capital letter before each word after that.

Example:
> *FileName*

## Exports Naming
Exports should begin with a capital letter if they are React components or a lowercase letter if they are not React components. Every word after that should begin with a capital letter.

Example:
> *ExportName* (React Component) 
> 
> *exportName* (Not React Component)

# Theming
As much as possible, theme once, and use everywhere. Include doc comments for all theming. 

Avoid using useTheme() to adjust component colors.

It is completely fine to use useTheme() for the borderRadius property.


# Terminating Ports
sudo lsof -i :<Port>

Try in order until one works:
kill -3 <PID>
kill -15 <PID>
kill -9 <PID>