| Root        | Collection    | Document       | Fields                                                                   | Access                                          | Subcollections                 | 
| ----------- | -----------   | -----------    | -----------                                                              | -----------                                     | -----------                    |
| /           | index         | organizations  | [orgName]: active?                                                       | Create organization (r, w)                      | N/A                            |
| /           | users         | [uid]          | info: {phonenumber, schedulename}, orgs: {[orgName]: active?}            | Author (r, w) & join org (r)                    | N/A                            |
| /           | [orgName]     | chat           | [email]: {fullname: -, roles: [mainRole, ...others], schedule name: - }  | (sd) Org members (r) & join org (w)             | subscriptions, chats           |
| /           | [orgName]     | public         | (memo) contents: -, person: [author], title: -                           | (!sd) Admin (r, w) & org members (r)            | users, docs                    |
| /           | [orgName]     | private        | (subscription) canAdd: -, userLimit: -                                   | (!sd) Create org (w)                            | roleKeys, userData, userParams |
| /           | [orgName]     | agenda         | (preview) title: {title: -, description: -, subtitle: -, }               | (!sd) Admin (r, w) & org members (r)            | forms, schedules               |


| Root        | Collection    | Document       | Fields                                                                   | Access                                          | Subcollections                 | 
| ----------- | -----------   | -----------    | -----------                                                              | -----------                                     | -----------                    |
| /chat       | subscriptions | [userEmail]    | [chatPath]: [...people], ...                                             | Join org (w) & send mess. (w) & owner (r, w)    | N/A                            |
| /chat       | chats         | [chatId]       | messages: [{body: -, sender: -, timestamp -}, ], subscribers: {[sub]: active?}  | Member (r, w) & send mess. (w)                  | N/A                            |
| /public     | docs          | roles          | roleName: {roleName: -, roleDescription: - }                             | Org member (r) & join org (w) & Admin (r, w)    | N/A                            |
| /public     | users         | [userEmail]    | admin: isAdmin?, roles: [...roles]                                       | Owner (g) & join org (w)                        | N/A                            |
| /private    | docs          | roleKeys       | roleName: {roleName: -, roleKey: -, roleDescription: - }                 | Admin (r, w)                                    | N/A                            |
| /private    | docs          | userData       | [userEmail]: {phonenumber: -, scheduleName: - }                          | Admin (r, w) & join org (w)                     | N/A                            |
| /agenda     | schedules     | [scheduleName] | title: -, type: -, contents: [{[column1]: -, [column2]: -}, ]            | Admin (r, w) & org members (r)                  | N/A                            |
| /agenda     | formData      | [userEmail]    | [scheduleName]: {[field]: string}                                        | Admin (r) & org member owners (r, w)            | N/A                            |


sd = include sub documents and collections in access rules
!sd = do not include sub documents and collections in access rules