<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <meta http-equiv='X-UA-Compatible' content='IE=edge'>
    <title>PeerChat</title>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
    <!-- <link rel='stylesheet' type='text/css' media='screen' href='lobby.css'> -->
    <link rel="stylesheet" href="{{ asset('css/lobby.css') }}">
<script src="{{ asset('js/routes.js.js') }}"> </script>


</head>
<body>
    
<main id="lobby-container">
        <div id="form-container">
        <div id="form__container__header"><br><p>CoA provide Affidavit</p></br>
            <br><p>Request Code to</p></br>
            <br>
                <p>Call Deponent</p>
            </div>
            <div id="form__content__wrapper">
                <form id="join-form">
                  
                    <input type="text" name="invite_link" id="invite_link" required/>
                   
                    
                     <!-- <input type="text" name="invite_link" required/>  -->
                     <input type="submit" value="Join Call Room" />
                </form>
            </div>
        </div>
</main> 

</body>
<!-- <script>
    let form = document.getElementById('join-form')
    form.addEventListener('submit', (e) => {
        e.preventDefault()
        let inviteCode = e.target.invite_link.value
        // window.location = `index.html?room=${inviteCode}` 
         window.location = `{{url('call')}}?room=${inviteCode}` 
        // window.location = route('call', { invite_code: inviteCode })
        // var callUrl = "{{ route('call') }}";
        // window.location =callUrl
        // console.log('bem')
    })
</script> -->

<script>
    let form = document.getElementById('join-form');
    //let select = document.getElementById('invite_link'); // Get the select element
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let inviteCode = document.getElementById('invite_link').value; // Get the sec_code value
       // let inviteCode = select.value;// Get the selected value from the select element
        // Construct the URL with the sec_code
        window.location = `{{ url('call') }}?room=${inviteCode}`;
    });
</script>
<!-- <script>
    let form = document.getElementById('join-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let inviteCode = document.getElementById('invite_link').value; // Get the sec_code value
        // Construct the URL with the sec_code
        window.location = `{{ url('call') }}?room=${inviteCode}`;
    });
</script> -->
<script src="{{ asset('js/ziggy.js') }}"> </script>


</html>