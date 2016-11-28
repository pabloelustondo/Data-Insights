/* Create by Doga Ister 11/28/2016 */
I added a git hook to make the JIRA id messages include the issue number.
Please copy the 'commit_message_checker.hook' file to your .git\hooks directory and remove the .hook extension to get
it working. Once that is in, commit messages will need a JIRA id as the first element, (e.g. MC-12345: Message).
