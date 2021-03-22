var array = ["egoing", "k8805", "hoya"];
console.log(array[0]);
var i = 0;
while (i < array.length) {
  console.log("arr:" + array[i]);
  i++;
}

var objects = {
  programmer: "egoing",
  desiner: "k8805",
  manager: "hoya",
};
console.log(objects.desiner);
console.log(objects["desiner"]);
for (var name in objects) {
  console.log("object=>" + name + "\nvalue=>" + objects[name]);
}
