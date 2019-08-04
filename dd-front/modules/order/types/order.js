import PropTypes from 'prop-types';

export default PropTypes.shape({
  user: PropTypes.object.isRequired,
  items: PropTypes.array.isRequired
});
