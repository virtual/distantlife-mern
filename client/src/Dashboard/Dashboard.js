import React, { Component } from 'react';
import { inject, observer } from 'mobx-react'; // tells whenever we use that thing it will get re-rendered from the userStore

var Dashboard = observer( class extends Component {

  render() {
    console.log(this.props.userStore.retrieveUser);
    return (
      <div>this {this.props.userStore.retrieveUser.firstName}</div>
    );
  }
});
// export default withRouter(inject("userStore")(Dashboard))
export default inject("userStore")(Dashboard);