import { Component } from 'react';
import '../components/Components.css';

export default class DemoTile extends Component {
  state = {
    hovered: false,
  }

  render() {
    const wallColors = ['#404040', '#3A3A3A']; // light, dark
    const waterColors = ['#B3FBFB', '#B0EAEA'];
    const portalColors = ["#D77DFF", "#CD72F4"];
    const player1Colors = ["#7DFF8D", "#72EC80"];
    const player2Colors = ["#FF7D9D", "#EC7290"];
    
    let colors = ['#F3F3F3', '#EAEAEA'];
    if (this.props.type === 'wall') {
      colors = wallColors;
    } else if (this.props.type === 'water') {
      colors = waterColors;
    } else if (this.props.type === 'portal') {
      colors = portalColors;
    } else if (this.props.type === 'p1-spawn') {
      colors = (this.props.flipped) ? player2Colors : player1Colors;
    } else if (this.props.type === 'p2-spawn') {
      colors = (this.props.flipped) ? player1Colors : player2Colors;
    }
    
    let className = 'demo tile';
    const animated = ['water', 'portal', 'p1-spawn', 'p2-spawn'];
    if (animated.includes(this.props.type)) {
      className += ' animated-tile';
    }

    return (
      <div 
      className={className}
      onMouseEnter={() => this.setState({ hovered: true })}
      onMouseLeave={() => this.setState({ hovered: false })}
      style={{
        ...( ((this.props.pos[0] + this.props.pos[1]) % 2 === 0) ? { backgroundColor: colors[0] } : { backgroundColor: colors[1]} ),
      }}>
        <p className='demo-tile-label'>{this.props.type}</p>
      </div>
    );
  }
}