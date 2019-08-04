import PropTypes from 'prop-types';

export default PropTypes.shape({
  type: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired
});
