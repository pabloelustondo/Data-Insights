/* Create by Doga Ister 11/28/2016 */
I added a git hook to make the JIRA ID mandatory.
Please copy the 'commit_msg.hook' file to your .git\hooks directory and remove the .hook extension to get
it working. Once that is in, commit messages will need a JIRA ID as the first element, (e.g. CB-12345: Message).
