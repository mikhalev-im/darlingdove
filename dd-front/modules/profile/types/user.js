import PropTypes from 'prop-types';

export default PropTypes.shape({
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  postalCode: PropTypes.string.isRequired
});
