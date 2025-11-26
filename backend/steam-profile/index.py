import json
import os
from typing import Dict, Any
from urllib import request, error

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Get Steam user profile data by Steam ID
    Args: event - dict with httpMethod, queryStringParameters (steamid)
          context - object with attributes: request_id, function_name
    Returns: HTTP response with user profile data (avatar, username, steamid)
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    params = event.get('queryStringParameters', {})
    steam_id = params.get('steamid', '')
    
    if not steam_id:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'steamid parameter is required'})
        }
    
    api_key = os.environ.get('STEAM_API_KEY', '')
    
    if not api_key:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Steam API key not configured'})
        }
    
    steam_id_64 = convert_to_steam64(steam_id)
    
    if not steam_id_64:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': 'Invalid Steam ID format'})
        }
    
    api_url = f'https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key={api_key}&steamids={steam_id_64}'
    
    try:
        with request.urlopen(api_url, timeout=10) as response:
            data = json.loads(response.read().decode('utf-8'))
            
            players = data.get('response', {}).get('players', [])
            
            if not players:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'isBase64Encoded': False,
                    'body': json.dumps({'error': 'Steam user not found'})
                }
            
            player = players[0]
            
            result = {
                'steamId': steam_id,
                'steamId64': steam_id_64,
                'username': player.get('personaname', 'Unknown'),
                'avatar': player.get('avatarfull', player.get('avatarmedium', player.get('avatar', ''))),
                'profileUrl': player.get('profileurl', ''),
                'realName': player.get('realname', ''),
            }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps(result)
            }
            
    except error.HTTPError as e:
        return {
            'statusCode': e.code,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': f'Steam API error: {e.reason}'})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'isBase64Encoded': False,
            'body': json.dumps({'error': f'Server error: {str(e)}'})
        }


def convert_to_steam64(steam_id: str) -> str:
    '''Convert various Steam ID formats to SteamID64'''
    steam_id = steam_id.strip()
    
    if steam_id.isdigit() and len(steam_id) == 17:
        return steam_id
    
    if steam_id.startswith('STEAM_'):
        parts = steam_id.split(':')
        if len(parts) == 3:
            try:
                universe = int(parts[0].split('_')[1])
                y = int(parts[1])
                z = int(parts[2])
                steam64 = 76561197960265728 + z * 2 + y
                return str(steam64)
            except (ValueError, IndexError):
                return ''
    
    if steam_id.startswith('[U:1:') and steam_id.endswith(']'):
        try:
            account_id = int(steam_id[5:-1])
            steam64 = 76561197960265728 + account_id
            return str(steam64)
        except ValueError:
            return ''
    
    return ''
