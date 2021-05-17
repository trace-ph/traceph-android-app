import {
  StyleSheet,
} from 'react-native';

module.exports = StyleSheet.create({
	// Text styles
	defaultFontSize: {
		fontSize: 24,
	},
	baseText: {
		fontFamily: 'Roboto',
	},
	headerText: {
		textAlign: 'left',
		width: '100%',
		fontSize: 34,
		marginBottom: 12,
		fontWeight: 'bold',
		color: '#666666',
	},
	desc: {
		textAlign: 'left',
		fontWeight: '100',
		fontWeight: '100',
		fontSize: 17,
		lineHeight: 35,
		color: '#808689',
		//backgroundColor: '#808689',
	},
	cardDesc: {
		textAlign: 'left',
		fontWeight: '100',
		fontWeight: '100',
		fontSize: 15,
		color: '#808689',
	},
	subText: {
		textAlign: 'left',
		fontWeight: '100',
		fontWeight: '100',
		fontSize: 12,
		color: '#808689',
	},
	link: {
		color: '#0888E2'
	},
	copy: {
		color: '#D63348'
	},

	// Button styles
	redButton: {
		borderRadius: 30,
		width: '90%',
		backgroundColor: '#D63348',
		alignSelf: 'center',
	},
	whiteButton: {
		borderRadius: 30,
		width: '90%',
		backgroundColor: '#FFFFFF',
		alignSelf: 'center',
	},

	// View styles
	defaultView: {
		backgroundColor: '#FFFFFF',
		flex: 1,
	},
	container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
	dimBG: {
		backgroundColor: 'rgba(0, 0, 0, 0.5)'
	},
	popUp: {
		backgroundColor: '#FFFFFF',
		borderRadius: 10,
		alignItems: 'center',
		elevation: 6,
		padding: 20,
	},

	// Styles for the OTP input fields
	root: {padding: 20, minHeight: 300},
	title: {textAlign: 'center', fontSize: 30},
	codeFieldRoot: {
		marginTop: 20,
		width: 280,
		marginLeft: 'auto',
		marginRight: 'auto',
	},
	cellRoot: { // Style of the underline input field
		width: 30,
		height: 60,
		justifyContent: 'center',
		alignItems: 'center',
		borderBottomColor: '#ccc',
		borderBottomWidth: 1,
	},
	cellText: {
		color: '#000',
		fontSize: 20,
		textAlign: 'center',
	},
	focusCell: {
		borderBottomColor: '#007AFF',
		borderBottomWidth: 2,
	},
});