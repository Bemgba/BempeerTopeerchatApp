<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\AffidavitRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
class CallController extends Controller
{
    //
public function call(){ 
    // $data['sec_code'] = AffidavitRequest::findOrFail($sec_code);
        // $affidavits = DB::table('affidavit_requests')
        // ->join('affidavit_types', 'affidavit_requests.type_id', '=', 'affidavit_types.id')
        // ->where('affidavit_requests.user_id',Auth::user()->id)
        // ->select('affidavit_requests.*','affidavit_types.type')
        // ->orderByDesc('updated_at')->paginate(15);       
        return view('callblade');
        // ->with('affidavits',$affidavits);
        // ->with('sec_code',$data);
}


    public function lobby(){  
 
        return view('lobby');
        
    }
    public function lobbyadmin(){  
  
        return view('lobbyadmin');
  
    }

    // public function show($id){
    //     $data['request_code'] = AffidavitRequest::findOrFail($id);
    //     return view('lobby', $data);
    // }
}