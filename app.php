<?php
ini_set('display_errors',0);
    require(dirname(__FILE__) . '/remote/init.php');

    // Get Request
    $request = new Request(array('restful' => false));

    //echo "<P>request: " . $request->to_string();
    if (!empty($request->controller)){
        // Get Controller
        require(dirname(__FILE__) . '/remote/app/controllers/' . $request->controller . '.php');
        $controller_name = ucfirst($request->controller);
        $controller = new $controller_name;
        $callback = $_GET['callback'];

        // Dispatch request
        $result = $controller->dispatch($request);
        if ($callback) {
            $result = $callback . '(' . $result . ');';
        }
        echo $result;
    }


