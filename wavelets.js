var h_0 = [-0.12940952255092145, 0.22414386804185735, 0.836516303737469, 0.48296291314469025].reverse();
//var h_0 = [-0.035226291882100656, 0.08544127388224149, 0.13501102001039084, -0.4598775021193313, -0.8068915093133388, -0.3326705529509569];
//var h_0 = [-0.08838834764831845, 0.08838834764831845, 0.7071067811865476, 0.7071067811865476, 0.08838834764831845, -0.08838834764831845];
//var h_0 = [-0.01565572813546454, -0.0727326195128539, 0.38486484686420286, 0.8525720202122554, 0.3378976624578092, -0.0727326195128539];

//var coeff = [-0.5, -0.2, 0.1, 0.4, 0.7];
var coeff = h_0;

function next_approximation(x_n, h_0) {
  var new_value_count = 2*x_n.length + h_0.length - 2;
  var new_x = Array(new_value_count).fill(0);

  for (var j = 0; j < new_value_count; j++) {
    var current_value = 0
    for (var k = 0; k < h_0.length; k++) {
      if ((j+k) % 2 == 0) {
        var i = (j-k) / 2;
        if(i >= 0 && i < x_n.length) {
          current_value = current_value + h_0[k] * x_n[i];
        }
      }
    }
    new_x[j] = current_value;
  }
  return new_x;
}

function scaling_approximation(coeff, num_approx) {
  var r = [1];
  for (var i = 0; i < num_approx; i++) {
    r = next_approximation(r, h_0);
  }
  return r
}

function shift_and_scale(phi, scale_coeff, num_approx) {
  var result = []
  var offset = Math.pow(2, num_approx);
  for (var i = 0; i < scale_coeff.length; i++) {
    var scaled = phi.map(function(d) { return d * scale_coeff[i]; })
    var start_buffer = Array(i*offset).fill(0);
    var end_buffer = Array((scale_coeff.length - 1 - i)*offset).fill(0);
    result.push(start_buffer.concat(scaled).concat(end_buffer));
  }

  return result;
}

function stack_data(data) {
  var length = data[0].length;
  var current_base = Array(length).fill(0);
  var result = []
  for (var i = 0; i < data.length; i++) {
    var sum = data[i].map(function(v, j) { return v + current_base[j]; })
    result[i] = sum.map(function(v, j) { return [current_base[j], v]; })
    current_base = sum;
  }
  return result;
}

function remaining_components(stacked_data, result) {
  var r = stacked_data.map( function(s) { return s.map( function(d, i) {
    var v0 = d[0];
    var v1 = d[1];

    var r = result[i];

    if (Math.sign(v0) != Math.sign(r)) {
      v0 = 0;
    }
    if (Math.sign(v1) != Math.sign(r)) {
      v1 = 0;
    }
    if (Math.abs(v0) > Math.abs(r)) {
      v0 = r;
    }
    if (Math.abs(v1) > Math.abs(r)) {
      v1 = r;
    }

    return [v0, v1];
  }); });

  return r;
}
