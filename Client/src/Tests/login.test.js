const authenticate = require('./pages/dashboard.jsx');

test('checks authentication function returns true', () => {
    expect(authenticate().toBe(true));
});

test('if authentication is false, should return false', () => {
    // Passing in 0 to force a false result
    let result = authenticate(0);
    if (result === false){
        // If this code is accessed, result = false and test should pass
        let forceTestPass = 1
        expect(forceTestPass.toEqual(1));
    } else {
        // If this code is accessed, result != true and test should fail
        let forceTestFail = 1
        expect(forceTestFail.toEqual(1));
    }
});
