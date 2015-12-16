import React from 'react';

class Component extends React.Component {

  render() {
    return <div>
      <h1> Hello  {this.props.name} ! </h1>
    </div>
  }
}

//Default Props
Component.defaultProps = {
  name: "Dude"
}

//Props Types
Component.propTypes = {
  name: React.PropTypes.string
}

export default Component
