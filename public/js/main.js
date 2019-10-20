$(document).ready(function() {
  $(".delete").on("click", function(e) {
    $target = $(e.target);
    const id = $target.attr("data-id");

    $.ajax({
      type: "DELETE",
      url: "/blog/" + id,
      success: function(response) {
        alert("Article Deleted");
        window.location.href = "/";
      },
      error: function(err) {
        console.log(err);
      }
    });
  });
});
