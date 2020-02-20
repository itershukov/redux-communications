export class Account {
  constructor({ id, firstName, lastName }) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
  }
}

export class AccountList {
  constructor(limit, offset) {
    this.data = [];
    for (let i = offset; i < offset + limit; i++) {
      this.data.push(new Account({ id: i, firstName: `${Math.random()}`, lastName: `${Math.random()}` }));
    }
  }
}
